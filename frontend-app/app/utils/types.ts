// utils/types.ts

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  companyId?: number;
}

export interface Company {
  id: number;
  companyName: string;
  taxNumber: string;
  address: string;
  email: string;
}

export interface Group {
  id: number;
  name: string;
  companyId: number;
}

export type RegisterForm = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (data: {
    emailOrUsername: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => void;
  checkTokenValidity: () => void;
  fetchUser: () => Promise<void>;
};

export type LoginForm = {
  emailOrUsername: string;
  password: string;
};