import { expect as baseExpect } from '@playwright/test';
import type { WebTablesPage } from '@pages/web-tables.page';
import type { Employee } from '@test-data/employee';

export const expect = baseExpect.extend({
  async toHaveEmployeeRow(webTablesPage: WebTablesPage, employee: Employee) {
    const actual = await webTablesPage.employeeRowData(employee.email);

    const expected: Record<string, string> = {
      'First Name': employee.firstName,
      'Last Name': employee.lastName,
      Age: employee.age,
      Email: employee.email,
      Salary: employee.salary,
      Department: employee.department,
    };

    const pass =
      actual !== null && Object.entries(expected).every(([key, value]) => actual[key] === value);

    return {
      pass,
      expected,
      actual,
      message: () =>
        `Expected employee row ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`,
    };
  },
});
