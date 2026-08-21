import { expect as baseExpect, type APIResponse } from '@playwright/test';
import type { ApiErrorSpec } from '@api-clients/api-errors';
import type { ApiMessage } from '@api-clients/types';

async function describeResponse(response: APIResponse): Promise<string> {
  const body = await response.text().catch(() => '<body unavailable>');

  return `\n\n${response.url()}\n${response.status()} ${response.statusText()}\n${body}`;
}

export const expect = baseExpect.extend({
  async toHaveStatus(response: APIResponse, expected: number) {
    const assertionName = 'toHaveStatus';
    const actual = response.status();
    const pass = actual === expected;
    const details = pass === this.isNot ? await describeResponse(response) : '';

    const message = () =>
      this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
      '\n\n' +
      `Expected: ${this.isNot ? 'not ' : ''}${this.utils.printExpected(expected)}\n` +
      `Received: ${this.utils.printReceived(actual)}` +
      details;

    return { message, pass, name: assertionName, expected, actual };
  },

  async toBeApiError(response: APIResponse, error: ApiErrorSpec) {
    const assertionName = 'toBeApiError';
    const status = response.status();
    const body = (await response.json().catch(() => undefined)) as ApiMessage | undefined;
    const expected = { status: error.status, code: error.code, message: error.message };
    const actual = { status, code: body?.code, message: body?.message };
    const pass =
      status === error.status && body?.code === error.code && body?.message === error.message;

    const message = () =>
      this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
      '\n\n' +
      `Expected: ${this.isNot ? 'not ' : ''}${this.utils.printExpected(expected)}\n` +
      `Received: ${this.utils.printReceived(actual)}\n\n` +
      response.url();

    return { message, pass, name: assertionName, expected, actual };
  },
});

export async function expectJson<T>(
  response: APIResponse,
  expectedStatus: number,
  message?: string,
): Promise<T> {
  await expect(response, message).toHaveStatus(expectedStatus);

  return (await response.json()) as T;
}
