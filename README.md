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
npm test                  # everything
npm run test:ui           # UI project only
npm run test:api          # API project only
npm run test:headed       # UI project with a browser
npm run test:parallel     # everything, 4 workers x 3 repeats
npm run test:api:parallel # API project, 4 workers x 3 repeats
npm run ui-mode           # Playwright UI mode
npm run report            # HTML report of the last run
npm run typecheck
```

Two Playwright projects: `ui` runs in Chromium, `api` launches no browser at all.

## Layout

```
api-clients/  transport: one method per endpoint, returns a raw APIResponse
asserts/      the only code that unpacks an APIResponse
steps/        business actions built on the clients, each one a test.step
fixtures/     Page Object fixtures; API fixtures with setup and cleanup
pages/        Page Objects: home, Elements, Web Tables
test-data/    generators for users, employees and catalog picks
tests/ui/     web-tables.spec.ts
tests/api/    create-user, add-books, delete-book
```

Dependencies point one way only:

```
api-clients <- test-data <- asserts <- steps <- fixtures <- tests
```

Every test creates its own user with a generated name, so the suite is safe at any worker
count. Users and their books are cleaned up automatically at teardown.
