import type { Locator, Page } from '@playwright/test';

export class ElementsPage {
  readonly page: Page;
  readonly webTablesMenuItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.webTablesMenuItem = page.locator('a[href="/webtables"]');
  }

  async openWebTables() {
    await this.webTablesMenuItem.click();
  }
}
