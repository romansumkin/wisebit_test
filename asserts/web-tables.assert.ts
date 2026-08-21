import { expect as baseExpect } from '@playwright/test';
import type { WebTablesPage } from '@pages/web-tables.page';
import type { Employee } from '@test-data/employee';

export const expect = baseExpect.extend({
  async toHaveEmployeeRow(
    webTablesPage: WebTablesPage,
    employee: Employee,
    options?: { timeout?: number },
  ) {
    const assertionName = 'toHaveEmployeeRow';
    let pass: boolean;
    let matcherResult: { actual?: unknown } | undefined;

    const expectedByColumn: Record<string, string> = {
      'First Name': employee.firstName,
      'Last Name': employee.lastName,
      Age: employee.age,
      Email: employee.email,
      Salary: employee.salary,
      Department: employee.department,
    };

    try {
      const row = webTablesPage.rowByEmail(employee.email);

      if (this.isNot) {
        await baseExpect(row).not.toHaveCount(1, options);
      } else {
        await baseExpect(row).toHaveCount(1, options);

        const columns = await webTablesPage.columnHeaders.allTextContents();

        for (const [column, value] of Object.entries(expectedByColumn)) {
          const columnIndex = columns.indexOf(column);

          if (columnIndex < 0) {
            throw new Error(`table has no "${column}" column (columns: ${columns.join(', ')})`);
          }

          await baseExpect(row.getByRole('cell').nth(columnIndex)).toHaveText(value, options);
        }
      }

      pass = true;
    } catch (e) {
      matcherResult = (e as { matcherResult?: { actual?: unknown } }).matcherResult;
      pass = false;
    }

    if (this.isNot) {
      pass = !pass;
    }

    const message = () =>
      this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
      '\n\n' +
      `Row for: ${employee.email}\n` +
      `Expected: ${this.isNot ? 'not ' : ''}${this.utils.printExpected(expectedByColumn)}\n` +
      (matcherResult ? `Received: ${this.utils.printReceived(matcherResult.actual)}` : '');

    return {
      message,
      pass,
      name: assertionName,
      expected: expectedByColumn,
      actual: matcherResult?.actual,
    };
  },
});
