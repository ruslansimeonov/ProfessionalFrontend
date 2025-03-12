export interface UserDetails {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  currentResidencyAddress?: string | null;
  birthPlaceAddress?: string | null;
  companyId?: number | null;
  createdAt: Date;
  updatedAt: Date;
  egn: string | null;
  iban: string | null;
}

export interface Company {
  id: number;
  companyName: string;
  taxNumber: string;
  address: string;
  email: string;
}

export interface EnrolledCourse {
  courseId: number;
  courseName: string;
  courseType: string;
  enrolledAt: Date;
  courseHours: number;
  courseDetails: string;
  coursePrice: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
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

export interface Group {
  id: number;
  name: string;
  companyId: number;
}

export interface User {
  details: UserDetails;
  company: Company | null;
  enrolledCourses: EnrolledCourse[];
  documents: Document[];
  certificates: Certificate[];
  role: Roles;
}

export type Roles =
  | "Admin"
  | "Instructor"
  | "Student"
  | "OfficeWorker"
  | "Company";

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
