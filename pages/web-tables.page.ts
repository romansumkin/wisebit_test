import { expect, type Locator, type Page } from '@playwright/test';
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

  async openRegistrationForm() {
    await this.addNewRecordButton.click();
  }

  async fillRegistrationForm(employee: Employee) {
    await this.firstNameInput.fill(employee.firstName);
    await this.lastNameInput.fill(employee.lastName);
    await this.emailInput.fill(employee.email);
    await this.ageInput.fill(employee.age);
    await this.salaryInput.fill(employee.salary);
    await this.departmentInput.fill(employee.department);
  }

  async submitRegistrationForm() {
    await this.submitButton.click();
  }

  rowByEmail(email: string): Locator {
    return this.rows.filter({
      has: this.page.getByRole('cell', { name: email, exact: true }),
    });
  }

  async expectEmployeeRow(employee: Employee) {
    const row = this.rowByEmail(employee.email);
    await expect(row).toHaveCount(1);

    const expectedByColumn: Record<string, string> = {
      'First Name': employee.firstName,
      'Last Name': employee.lastName,
      Age: employee.age,
      Email: employee.email,
      Salary: employee.salary,
      Department: employee.department,
    };
    const columns = await this.columnHeaders.allTextContents();

    for (const [column, value] of Object.entries(expectedByColumn)) {
      const columnIndex = columns.indexOf(column);
      expect(columnIndex, `table has a "${column}" column`).toBeGreaterThanOrEqual(0);
      await expect(row.getByRole('cell').nth(columnIndex)).toHaveText(value);
    }
  }
}
