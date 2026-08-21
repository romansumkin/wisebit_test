# AQA test assignment

TypeScript + Playwright tests for https://demoqa.com/.

- Part A — UI: adding a record to the Web Tables table and checking that it shows up.
- Part B — API: creating a user, adding a book to their collection and deleting it.

## Docker

Nothing but Docker is needed

```bash
npm run docker:test        # build the image and run the whole suite
npm run docker:test:ui     # UI project only
npm run docker:test:api    # API project only
npm run docker:report      # HTML report of the last run on http://localhost:9323
```

Without npm the same thing is:

```bash
docker compose run --rm --build tests
docker compose run --rm --build tests npx playwright test --project=ui
docker compose --profile report up --build report
```

The image is `mcr.microsoft.com/playwright:v1.62.1-noble`, which already carries Chromium
and its system libraries; its tag has to be bumped together with `@playwright/test`.
`CI=true` is set inside the image, so retries and `forbidOnly` behave the way they do on CI.
`playwright-report/` and `test-results/` are mounted from the repo, so the report and the
traces of a failed run stay on the host. The container exits with the Playwright exit code.

## Running locally

```bash
npm install
npx playwright install chromium

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
asserts/      custom matchers (expect.extend) plus the expectJson helper
fixtures/     Page Object fixtures; API fixtures with setup and user cleanup
pages/        Page Objects inheriting BasePage (own open() per page)
test-data/    faker-based generators for users, employees and catalog picks
tests/ui/     web-tables.spec.ts
tests/api/    create-user, add-books, delete-book
```

Dependencies point one way only:

```
api-clients, pages, test-data <- asserts <- fixtures <- tests
```

Every test creates its own user with a generated name, so the suite is safe at any worker
count. Users and their books are cleaned up automatically at teardown.
