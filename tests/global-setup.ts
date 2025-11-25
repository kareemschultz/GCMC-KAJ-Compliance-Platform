import { FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Global setup started...');
  console.log('✅ Global setup completed successfully!');
}

export default globalSetup;
