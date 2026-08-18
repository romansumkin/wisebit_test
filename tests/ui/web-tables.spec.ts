import { test, expect } from '../fixtures/pages.fixture';
import { newEmployee } from '../test-data/employee';

test('record added via the form appears in the table', async ({
  page,
  homePage,
  elementsPage,
  webTablesPage,
}) => {
  await test.step('open demoqa.com and go to Elements', async () => {
    await homePage.open();
    await homePage.openElementsSection();
    await expect(page).toHaveURL('/elements');
  });

  await test.step('open Web Tables', async () => {
    await elementsPage.openWebTables();
    await expect(webTablesPage.header).toHaveText('Web Tables');
  });

  await test.step('fill in the form and submit it', async () => {
    await webTablesPage.openRegistrationForm();
    await expect(webTablesPage.registrationModal).toBeVisible();

    await webTablesPage.fillRegistrationForm(newEmployee);
    await webTablesPage.submitRegistrationForm();
  });

  await test.step('check the record was added to the table', async () => {
    await expect(webTablesPage.registrationModal).toBeHidden();
    await expect(webTablesPage.rowByEmail(newEmployee.email)).toHaveCount(1);
    await expect(webTablesPage.cellsByEmail(newEmployee.email)).toHaveText([
      newEmployee.firstName,
      newEmployee.lastName,
      newEmployee.age,
      newEmployee.email,
      newEmployee.salary,
      newEmployee.department,
      '', //actions
    ]);
  });
});
