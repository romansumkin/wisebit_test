# AQA test assignment — Part A

UI test in TypeScript + Playwright: adding a record to the Web Tables table
on https://demoqa.com/ and checking that it shows up.

## Setup

```bash
npm install
npx playwright install chromium
```

## Running

```bash
npm test              # headless
npm run test:headed   # with a browser
npm run test:ui       # Playwright UI mode
npm run report        # HTML report of the last run
npm run typecheck
```

## Layout

```
pages/        Page Objects: home, Elements, Web Tables
fixtures/     Page Object fixtures, demoqa ad blocking
test-data/    Employee type and the data from the assignment
tests/        web-tables.spec.ts
```

## Not covered

Table pagination (10 rows per page) never kicks in here: the test data is under our
control and the table holds 4 rows after the record is added. Negative cases for the
form, editing and deleting a record are out of scope for part A.
