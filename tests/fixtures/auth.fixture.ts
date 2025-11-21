import { test as base } from '@playwright/test';

// Define the types for our fixtures
type AuthFixtures = {
  adminPage: any;
  gcmcPage: any;
  kajPage: any;
  clientPage: any;
};

// Create authenticated fixtures for different user roles
export const test = base.extend<AuthFixtures>({
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: './tests/auth/admin-storage-state.json'
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  gcmcPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: './tests/auth/gcmc-storage-state.json'
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  kajPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: './tests/auth/kaj-storage-state.json'
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  clientPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: './tests/auth/client-storage-state.json'
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';