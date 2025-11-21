import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

async function globalTeardown() {
  console.log('🧹 Global teardown started...');

  // Clean up test data from database
  if (process.env.DATABASE_URL) {
    console.log('🗑️  Cleaning up test database...');
    const prisma = new PrismaClient();

    try {
      // Clean up test data
      await prisma.user.deleteMany({
        where: {
          email: {
            in: ['admin@gcmc.gy', 'gcmc@gcmc.gy', 'kaj@gcmc.gy', 'client@testcorp.gy']
          }
        }
      });
      await prisma.client.deleteMany({ where: { name: 'Test Corporation Ltd' } });

      console.log('✅ Test database cleanup complete');
      await prisma.$disconnect();
    } catch (error) {
      console.error('❌ Database cleanup failed:', error);
      await prisma.$disconnect();
    }
  }

  // Clean up auth storage files
  const authDir = './tests/auth';
  if (fs.existsSync(authDir)) {
    const files = fs.readdirSync(authDir);
    for (const file of files) {
      if (file.endsWith('-storage-state.json')) {
        fs.unlinkSync(path.join(authDir, file));
      }
    }
    console.log('🔐 Cleaned up auth storage files');
  }

  console.log('✅ Global teardown completed successfully!');
}

export default globalTeardown;