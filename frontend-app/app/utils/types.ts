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
  enrolledAt: Date;
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
}


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

/**
 * API Response Structure
 */
export interface AuthenticatedUserResponse {
  user: UserDetails;  // This is correct as the API returns user details here
  company: Company | null;
  enrolledCourses: EnrolledCourse[];
  documents: Document[];
  certificates: Certificate[];
}

