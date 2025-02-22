export interface User {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  company?: Company;
  roles?: string[]; // User roles (e.g., ["Admin", "Student"])
  enrolledCourses?: EnrolledCourse[];
  documents?: Document[];
  certificates?: Certificate[];
  groups?: Group[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: number;
  documentType: string;
  documentUrl: string;
  uploadedAt: Date;
  isActive: boolean;
}

export interface Certificate {
  id: number;
  certificateUrl: string;
  issuedAt: Date;
  expirationDate: Date;
  isActive: boolean;
}

export interface EnrolledCourse {
  courseId: number;
  courseName: string;
  enrolledAt: Date;
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
