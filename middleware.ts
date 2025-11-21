import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Allow access to login page and public pages
    if (pathname === "/login" || pathname === "/book" || pathname.startsWith("/portal")) {
      return NextResponse.next()
    }

    // Require authentication for dashboard routes
    if (pathname.startsWith("/(dashboard)") || pathname === "/") {
      if (!token) {
        const url = new URL("/login", req.url)
        return NextResponse.redirect(url)
      }

      // Role-based access control
      const userRole = token.role

      // Super admin can access everything
      if (userRole === "SUPER_ADMIN") {
        return NextResponse.next()
      }

      // GCMC staff access restrictions
      if (userRole === "GCMC_STAFF") {
        const gcmcRoutes = [
          "/immigration", "/training", "/network", "/paralegal",
          "/property", "/expediting", "/clients", "/documents"
        ]
        const hasAccess = gcmcRoutes.some(route => pathname.startsWith(route))
        if (!hasAccess && pathname !== "/") {
          return NextResponse.redirect(new URL("/unauthorized", req.url))
        }
      }

      // KAJ staff access restrictions
      if (userRole === "KAJ_STAFF") {
        const kajRoutes = [
          "/filings", "/accounting", "/nis", "/clients", "/documents"
        ]
        const hasAccess = kajRoutes.some(route => pathname.startsWith(route))
        if (!hasAccess && pathname !== "/") {
          return NextResponse.redirect(new URL("/unauthorized", req.url))
        }
      }

      // Clients should only access portal
      if (userRole === "CLIENT") {
        return NextResponse.redirect(new URL("/portal", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname

        // Public routes don't need authorization
        if (pathname === "/login" || pathname === "/book" || pathname.startsWith("/portal")) {
          return true
        }

        // Protected routes require a token
        return !!token
      }
    }
  }
)

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ]
}