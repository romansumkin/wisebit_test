import { test as base, expect } from '@playwright/test';
import { HomePage } from '@pages/home.page';
import { ElementsPage } from '@pages/elements.page';
import { WebTablesPage } from '@pages/web-tables.page';

type Pages = {
  homePage: HomePage;
  elementsPage: ElementsPage;
  webTablesPage: WebTablesPage;
};

const ADS = /googlesyndication|doubleclick|googletagservices|googletagmanager|google-analytics|adservice\.google/;

export const test = base.extend<Pages>({
  page: async ({ page }, use) => {
    await page.route(ADS, (route) => route.abort());
    await use(page);
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  elementsPage: async ({ page }, use) => {
    await use(new ElementsPage(page));
  },

  webTablesPage: async ({ page }, use) => {
    await use(new WebTablesPage(page));
  },
});

export { expect };
