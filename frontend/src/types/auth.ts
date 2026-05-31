export interface User {
  email: string;
  nickname: string;
  password: string;
  is_active: string;
  last_login: string;
}

export interface UserRead {
  email: string;
  nickname: string;
  is_active: string;
  last_login: string;
}

export interface UserCreate {
  email: string;
  nickname: string;
  password: string;
}

export interface LoginSchema {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  type: "bearer"
}