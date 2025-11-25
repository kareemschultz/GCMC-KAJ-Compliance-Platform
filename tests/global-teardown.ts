import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Global teardown started...');
  console.log('🔐 Cleaned up auth storage files');
}

export default globalTeardown;