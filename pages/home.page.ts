import type { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly elementsCard: Locator;

  constructor(page: Page) {
    this.page = page;
    this.elementsCard = page.getByRole('heading', { name: 'Elements', exact: true });
  }

  async open() {
    await this.page.goto('/');
  }

  async openElementsSection() {
    await this.elementsCard.click();
  }
}
