import { test, expect } from '@fixtures/pages.fixture';
import { createEmployee } from '@test-data/employee';

test('web tables page is reachable from the home page', async ({
  page,
  homePage,
  elementsPage,
  webTablesPage,
}) => {
  await test.step('open demoqa.com and go to Elements', async () => {
    await homePage.open();
    await homePage.openElementsSection();
    await expect(page, 'elements page url').toHaveURL('/elements');
  });

  await test.step('open Web Tables from the side menu', async () => {
    await elementsPage.openWebTables();
    await expect(webTablesPage.header, 'page header').toHaveText('Web Tables');
  });
});

test('record added via the form appears in the table', async ({ webTablesPage }) => {
  const employee = createEmployee();

  await test.step('open the Web Tables page', async () => {
    await webTablesPage.open();
    await expect(webTablesPage.header, 'page header').toHaveText('Web Tables');
  });

  const rowsBefore = await webTablesPage.filledRows.count();

  await test.step(`fill in the form for ${employee.email} and submit it`, async () => {
    await webTablesPage.openRegistrationForm();
    await expect(webTablesPage.registrationModal, 'registration modal').toBeVisible();

    await webTablesPage.fillRegistrationForm(employee);
    await webTablesPage.submitRegistrationForm();
  });

  await test.step('check the record was added to the table', async () => {
    await expect(webTablesPage.registrationModal, 'registration modal').toBeHidden();
    await expect(webTablesPage.filledRows, 'filled rows after adding a record').toHaveCount(
      rowsBefore + 1,
    );
    await expect(webTablesPage, 'new employee row').toHaveEmployeeRow(employee);
  });
});
