# Playwright image tag must match the @playwright/test version in package.json:
# it already ships Chromium and every system library the browser needs.
FROM mcr.microsoft.com/playwright:v1.62.1-noble

WORKDIR /app

# CI mode turns on retries and forbidOnly (see playwright.config.ts)
ENV CI=true

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD ["npx", "playwright", "test"]
