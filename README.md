# AQA test assignment

TypeScript + Playwright tests for https://demoqa.com/.

- Part A — UI: adding a record to the Web Tables table and checking that it shows up.
- Part B — API: creating a user, adding a book to their collection and deleting it.

## Setup

```bash
npm install
npx playwright install chromium
```

## Running

```bash
npm test              # everything
npm run test:ui       # UI project only
npm run test:api      # API project only
npm run test:headed   # UI project with a browser
npm run ui-mode       # Playwright UI mode
npm run report        # HTML report of the last run
npm run typecheck
```

## Layout

```
pages/        Page Objects: home, Elements, Web Tables
api-clients/  Book Store API clients and response types
fixtures/     Page Object fixtures; API fixtures with user setup and cleanup
test-data/    Employee data for the form, random credentials for the API
tests/ui/     web-tables.spec.ts
tests/api/    create-user, add-books, delete-book
```

## API tests

Two Playwright projects. `ui` runs in Chromium, `api` launches no browser at all — nothing
in those tests asks for a page, so the browser fixture is never instantiated.

Every test registers its own user with a random name, so nothing is shared between tests.
That is what makes both parallel execution and retries safe: a retry starts from a brand new
user rather than inheriting whatever the failed attempt left behind.

One positive and one negative scenario per endpoint, as required. The negatives deliberately
cover three different classes of failure rather than three flavours of input validation:
a duplicate user name (406), a missing token (401) and deleting a book the user does not own
(400).

Writes are verified by re-reading `GET /Account/v1/User/{UserId}`, not by trusting the
response to the write. This mirrors the UI test, which re-reads the table instead of trusting
the success modal, and it matters here: `DELETE /BookStore/v1/Book` answers with an empty 204,
and the 201 from `POST /BookStore/v1/Books` echoes the request rather than the resulting state.

Two things about this API are worth knowing before reading the code:

- `POST /Account/v1/User` returns the id as `userID`, while `GET /Account/v1/User/{UserId}`
  returns it as `userId`. Hence two types, `CreateUserResult` and `UserProfile`.
- A duplicate is detected by the user name and password together. The negative test has to
  send both unchanged — with a different password demoqa happily creates a second account
  and answers 201.

## Cleanup

Users are collected in the `createdUsers` fixture and removed in its teardown, books first,
then the user itself. Cleanup errors are swallowed: a public demo stand having a bad moment
should not turn a passing test red.

The fixture depends on the API clients, so the request context is guaranteed to still be
alive when the teardown runs — an `afterEach` hook gives no such guarantee.

User names are random, so the suite stays correct even if cleanup does not run at all.
It is hygiene on a shared stand, not a correctness requirement.

## Not covered

Table pagination (10 rows per page) never kicks in here: the test data is under our
control and the table holds 4 rows after the record is added. Negative cases for the
form, editing and deleting a record are out of scope for part A.

On the API side: the remaining error cases (weak password 1300, missing credentials 1200,
unknown ISBN 1205, duplicate book 1210), `PUT /BookStore/v1/Books/{ISBN}`,
`POST /Account/v1/Authorized`, token expiry and schema validation of the responses.

The UI and API fixtures are kept in separate files rather than combined with `mergeTests`,
since the two projects have disjoint test directories and no spec needs both. That changes
the day a test seeds state over the API and asserts the result in the browser.
