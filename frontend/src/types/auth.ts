export type User = {
  id: string;
  name: string;
  username:string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
};

export type LoginCredentials = {
  username: string;
  password: string;
};

export type RegisterCredentials = {
  name: string;
  username: string;
  password: string;
};
