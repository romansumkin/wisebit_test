export type ApiErrorSpec = {
  readonly status: number;
  readonly code: string;
  readonly message: string;
};

export const USER_EXISTS: ApiErrorSpec = {
  status: 406,
  code: '1204',
  message: 'User exists!',
};

export const NOT_AUTHORIZED: ApiErrorSpec = {
  status: 401,
  code: '1200',
  message: 'User not authorized!',
};

export const ISBN_NOT_IN_COLLECTION: ApiErrorSpec = {
  status: 400,
  code: '1206',
  message: "ISBN supplied is not available in User's Collection!",
};
