import { BasePage } from './base.page';

export class ElementsPage extends BasePage {
  protected readonly path = '/elements';

  readonly webTablesMenuItem = this.page.locator('a[href="/webtables"]');

  async openWebTables(): Promise<void> {
    await this.webTablesMenuItem.click();
  }
}
