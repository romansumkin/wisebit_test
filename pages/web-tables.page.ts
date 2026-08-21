import type { Locator } from '@playwright/test';
import type { Employee } from '@test-data/employee';
import { BasePage } from './base.page';

export class WebTablesPage extends BasePage {
  protected readonly path = '/webtables';

  readonly header = this.page.getByRole('heading', { level: 1 });
  readonly addNewRecordButton = this.page.locator('#addNewRecordButton');
  readonly rows = this.page.getByRole('table').locator('tbody tr');
  readonly filledRows = this.rows.filter({ hasText: /\w/ });
  readonly columnHeaders = this.page.getByRole('table').getByRole('columnheader');

  readonly registrationModal = this.page.getByRole('dialog');
  readonly firstNameInput = this.registrationModal.locator('#firstName');
  readonly lastNameInput = this.registrationModal.locator('#lastName');
  readonly emailInput = this.registrationModal.locator('#userEmail');
  readonly ageInput = this.registrationModal.locator('#age');
  readonly salaryInput = this.registrationModal.locator('#salary');
  readonly departmentInput = this.registrationModal.locator('#department');
  readonly submitButton = this.registrationModal.locator('#submit');

  async openRegistrationForm(): Promise<void> {
    await this.addNewRecordButton.click();
  }

  async fillRegistrationForm(employee: Employee): Promise<void> {
    await this.firstNameInput.fill(employee.firstName);
    await this.lastNameInput.fill(employee.lastName);
    await this.emailInput.fill(employee.email);
    await this.ageInput.fill(employee.age);
    await this.salaryInput.fill(employee.salary);
    await this.departmentInput.fill(employee.department);
  }

  async submitRegistrationForm(): Promise<void> {
    await this.submitButton.click();
  }

  rowByEmail(email: string): Locator {
    return this.rows.filter({
      has: this.page.getByRole('cell', { name: email, exact: true }),
    });
  }

  async employeeRowData(email: string): Promise<Record<string, string> | null> {
    const row = this.rowByEmail(email);
    await row.first().waitFor({ state: 'visible' }).catch(() => {});

    if ((await row.count()) !== 1) {
      return null;
    }

    const headers = await this.columnHeaders.allTextContents();
    const cells = await row.getByRole('cell').allTextContents();

    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? '']));
  }
}
