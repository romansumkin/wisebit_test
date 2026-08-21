import { BasePage } from './base.page';

export class HomePage extends BasePage {
  protected readonly path = '/';

  readonly elementsCard = this.page.getByRole('heading', { name: 'Elements', exact: true });

  async openElementsSection(): Promise<void> {
    await this.elementsCard.click();
  }
}
