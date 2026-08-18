import type { Locator, Page } from '@playwright/test';
import type { Employee } from '@test-data/employee';

export class WebTablesPage {
  readonly page: Page;
  readonly header: Locator;
  readonly addNewRecordButton: Locator;
  readonly rows: Locator;
  readonly columnHeaders: Locator;

  readonly registrationModal: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly ageInput: Locator;
  readonly salaryInput: Locator;
  readonly departmentInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByRole('heading', { level: 1 });
    this.addNewRecordButton = page.locator('#addNewRecordButton');
    this.rows = page.getByRole('table').locator('tbody tr');
    this.columnHeaders = page.getByRole('table').getByRole('columnheader');

    this.registrationModal = page.getByRole('dialog');
    this.firstNameInput = this.registrationModal.locator('#firstName');
    this.lastNameInput = this.registrationModal.locator('#lastName');
    this.emailInput = this.registrationModal.locator('#userEmail');
    this.ageInput = this.registrationModal.locator('#age');
    this.salaryInput = this.registrationModal.locator('#salary');
    this.departmentInput = this.registrationModal.locator('#department');
    this.submitButton = this.registrationModal.locator('#submit');
  }

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

}
