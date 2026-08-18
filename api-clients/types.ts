export type Credentials = {
  readonly userName: string;
  readonly password: string;
};

export type Book = {
  isbn: string;
  title: string;
  subTitle: string;
  author: string;
  publish_date: string;
  publisher: string;
  pages: number;
  description: string;
  website: string;
};

export type BookList = {
  books: Book[];
};

export type CreateUserResult = {
  userID: string;
  username: string;
  books: Book[];
};

export type UserProfile = {
  userId: string;
  username: string;
  books: Book[];
};

export type TokenViewModel = {
  token: string;
  expires: string;
  status: string;
  result: string;
};

export type ApiMessage = {
  code: string;
  message: string;
};

export type AddBooksPayload = {
  readonly userId: string;
  readonly isbns: readonly string[];
};

export type DeleteBookPayload = {
  readonly userId: string;
  readonly isbn: string;
};
