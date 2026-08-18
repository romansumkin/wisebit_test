export type BookModal = {
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

export type AllBooksModal = {
  books: BookModal[];
};

export type CreateUserResult = {
  userID: string;
  username: string;
  books: BookModal[];
};

export type UserProfile = {
  userId: string;
  username: string;
  books: BookModal[];
};

export type TokenViewModel = {
  token: string;
  expires: string;
  status: string;
  result: string;
};

export type MessageModal = {
  code: string;
  message: string;
};

export type AddBooksPayload = {
  userId: string;
  isbns: string[];
};

export type DeleteBookPayload = {
  userId: string;
  isbn: string;
};
