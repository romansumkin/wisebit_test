import { test, expect } from '@fixtures/pages.fixture';
import { createEmployee } from '@test-data/employee';

test('record added via the form appears in the table', async ({
  page,
  homePage,
  elementsPage,
  webTablesPage,
}) => {
  const employee = createEmployee();

  await test.step('open demoqa.com and go to Elements', async () => {
    await homePage.open();
    await homePage.openElementsSection();
    await expect(page).toHaveURL('/elements');
  });

  await test.step('open Web Tables', async () => {
    await elementsPage.openWebTables();
    await expect(webTablesPage.header).toHaveText('Web Tables');
  });

  await test.step(`fill in the form for ${employee.email} and submit it`, async () => {
    await webTablesPage.openRegistrationForm();
    await expect(webTablesPage.registrationModal).toBeVisible();

    await webTablesPage.fillRegistrationForm(employee);
    await webTablesPage.submitRegistrationForm();
  });

  await test.step('check the record was added to the table', async () => {
    await expect(webTablesPage.registrationModal).toBeHidden();
    await webTablesPage.expectEmployeeRow(employee);
  });
});
