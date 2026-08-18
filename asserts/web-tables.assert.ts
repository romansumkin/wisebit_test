import { expect } from '@playwright/test';
import type { WebTablesPage } from '@pages/web-tables.page';
import type { Employee } from '@test-data/employee';

export async function expectEmployeeRow(
  webTablesPage: WebTablesPage,
  employee: Employee,
): Promise<void> {
  const row = webTablesPage.rowByEmail(employee.email);
  await expect(row).toHaveCount(1);

  const expectedByColumn: Record<string, string> = {
    'First Name': employee.firstName,
    'Last Name': employee.lastName,
    Age: employee.age,
    Email: employee.email,
    Salary: employee.salary,
    Department: employee.department,
  };
  const columns = await webTablesPage.columnHeaders.allTextContents();

  for (const [column, value] of Object.entries(expectedByColumn)) {
    const columnIndex = columns.indexOf(column);
    expect(columnIndex, `table has a "${column}" column`).toBeGreaterThanOrEqual(0);
    await expect(row.getByRole('cell').nth(columnIndex)).toHaveText(value);
  }
}
