import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch all statistics in parallel
    const [
      totalClients,
      activeClients,
      totalTaxReturns,
      pendingTaxReturns,
      totalNISSchedules,
      totalVisaApplications,
      expiringVisas,
      totalTrainingSessions,
      upcomingTrainingSessions,
      totalPartners,
      totalEmployees,
      totalProperties,
      totalRevenue,
      monthlyRevenue
    ] = await Promise.all([
      // Client stats
      prisma.client.count(),
      prisma.client.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Active in last 30 days
          }
        }
      }),

      // Tax stats
      prisma.taxReturn.count(),
      prisma.taxReturn.count({
        where: { status: "PENDING" }
      }),

      // NIS stats
      prisma.nISSchedule.count(),

      // Immigration stats
      prisma.visaApplication.count(),
      prisma.visaApplication.count({
        where: {
          expiryDate: {
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expiring in 30 days
            gte: new Date()
          }
        }
      }),

      // Training stats
      prisma.trainingSession.count(),
      prisma.trainingSession.count({
        where: {
          date: {
            gte: new Date()
          }
        }
      }),

      // Partner stats
      prisma.partner.count(),

      // Employee stats
      prisma.employee.count(),

      // Property stats
      prisma.property.count(),

      // Financial stats (aggregate from tax returns)
      prisma.taxReturn.aggregate({
        _sum: {
          amountDue: true
        }
      }),

      // Monthly revenue (current month)
      prisma.taxReturn.aggregate({
        _sum: {
          amountDue: true
        },
        where: {
          filingDate: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
          }
        }
      })
    ])

    // Calculate compliance score (percentage of submitted/approved tax returns)
    const completedReturns = await prisma.taxReturn.count({
      where: {
        status: {
          in: ["SUBMITTED", "APPROVED"]
        }
      }
    })

    const complianceScore = totalTaxReturns > 0
      ? Math.round((completedReturns / totalTaxReturns) * 100)
      : 100

    // Get recent activity
    const recentActivity = await prisma.$transaction([
      prisma.client.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          createdAt: true,
        }
      }),
      prisma.taxReturn.findMany({
        take: 5,
        orderBy: { filingDate: "desc" },
        select: {
          id: true,
          filingType: true,
          status: true,
          filingDate: true,
          client: {
            select: {
              name: true
            }
          }
        }
      }),
      prisma.visaApplication.findMany({
        take: 5,
        orderBy: { id: "desc" },
        select: {
          id: true,
          applicantName: true,
          permitType: true,
          status: true,
          client: {
            select: {
              name: true
            }
          }
        }
      })
    ])

    // Format recent activity
    const formattedActivity = [
      ...recentActivity[0].map(client => ({
        type: "NEW_CLIENT",
        description: `New client registered: ${client.name}`,
        timestamp: client.createdAt,
      })),
      ...recentActivity[1].map(taxReturn => ({
        type: "TAX_FILING",
        description: `${taxReturn.filingType} filed for ${taxReturn.client.name}`,
        timestamp: taxReturn.filingDate,
        status: taxReturn.status
      })),
      ...recentActivity[2].map(visa => ({
        type: "VISA_APPLICATION",
        description: `${visa.permitType} for ${visa.applicantName}`,
        timestamp: new Date(),
        status: visa.status
      }))
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10)

    // Calculate growth rates (mock for now as we need historical data)
    const stats = {
      overview: {
        totalClients,
        activeClients,
        clientGrowth: 12.5, // Placeholder
        complianceScore,
        totalRevenue: Number(totalRevenue._sum.amountDue) || 0,
        monthlyRevenue: Number(monthlyRevenue._sum.amountDue) || 0,
        revenueGrowth: 8.3, // Placeholder
      },
      taxCompliance: {
        totalReturns: totalTaxReturns,
        pendingReturns: pendingTaxReturns,
        approvedReturns: completedReturns,
        complianceRate: complianceScore,
        totalNISSchedules,
      },
      immigration: {
        totalApplications: totalVisaApplications,
        expiringVisas,
        processingTime: "5-7 days", // Placeholder
      },
      training: {
        totalSessions: totalTrainingSessions,
        upcomingSessions: upcomingTrainingSessions,
        totalAttendees: 0, // Would need to count attendees
      },
      resources: {
        totalPartners,
        totalEmployees,
        totalProperties,
      },
      recentActivity: formattedActivity
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}