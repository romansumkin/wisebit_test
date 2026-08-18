import { expect, type APIResponse } from '@playwright/test';
import type { ApiErrorSpec } from '@api-clients/api-errors';
import type { ApiMessage } from '@api-clients/types';

async function describe(response: APIResponse): Promise<string> {
  const body = await response.text().catch(() => '<body unavailable>');

  return `\n${response.url()}\n${response.status()} ${response.statusText()}\n${body}`;
}

export async function expectStatus(response: APIResponse, expected: number): Promise<void> {
  const actual = response.status();
  const details = actual === expected ? '' : await describe(response);

  expect(actual, `response status${details}`).toBe(expected);
}

export async function expectJson<T>(response: APIResponse, expected: number): Promise<T> {
  await expectStatus(response, expected);

  return (await response.json()) as T;
}

export async function expectNoContent(response: APIResponse): Promise<void> {
  await expectStatus(response, 204);
  expect(await response.text(), 'response body').toBe('');
}

export async function expectApiError(response: APIResponse, error: ApiErrorSpec): Promise<void> {
  const body = await expectJson<ApiMessage>(response, error.status);

  expect(body, 'error response').toMatchObject({ code: error.code, message: error.message });
}
