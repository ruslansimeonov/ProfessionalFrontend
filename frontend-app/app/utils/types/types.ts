export interface UserDetails {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  currentResidencyAddress?: string | null;
  birthPlaceAddress?: string | null;
  companyId?: number | undefined;
  createdAt: Date;
  updatedAt: Date;
  EGN: string | null;
  iban: string | null;
}

export interface Company {
  id: number;
  companyName: string;
  taxNumber: string;
  address: string;
  email: string;
  phoneNumber: string;

  MOL: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invitation {
  id: number;
  invitationCode: string;
  maxUses: number;
  currentUses: number;
  usageCount: number;
  expiresAt: string;
  isActive: boolean;
  isExpired: boolean;
  isUsable: boolean;
  companyName: string;
  createdByName: string;
  createdAt: string;
}

export interface Course {
  id: number;
  courseName: string;
  courseType: string;
  courseHours: number;
  courseDetails: string | null;
  coursePrice: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
}

export interface EnrolledCourse {
  id: number;
  userId: number;
  courseId: number;
  enrolledAt: string | Date;
  closestCityId: number;
  course: Course;
}

export interface Document {
  id: number;
  documentType: string;
  documentUrl: string;
  uploadedAt: Date;
  isActive: boolean;
  documentStatus?: "complete" | "incomplete" | "unknown";
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
  description?: string;
  companyId?: number;
  companyName?: string | null;

  // Capacity management
  maxParticipants: number;
  currentParticipants: number;

  // Status tracking
  status: "active" | "full" | "closed" | "completed" | "cancelled";
  registrationDeadline?: string;
  isRegistrationOpen: boolean;

  createdAt: Date;
  updatedAt: Date;
  users?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  }[];
}

// Group invitation interface
export interface GroupInvitation {
  id: number;
  groupId: number;
  invitationCode: string;
  description?: string;
  maxUses: number;
  currentUses: number;
  usageCount: number; // Alias for currentUses
  expiresAt: string;
  isActive: boolean;
  isExpired: boolean;
  isUsable: boolean;
  createdByName: string;
  createdAt: string;
}

// Group capacity info
export interface GroupCapacity {
  hasCapacity: boolean;
  currentParticipants: number;
  maxParticipants: number;
  availableSpots: number;
}

export interface User {
  details: UserDetails;
  company?: Company | null;
  enrolledCourses?: EnrolledCourse[];
  documents?: Document[];
  certificates?: Certificate[];
  role: Roles | Roles[]; // Accept both single role and array of roles
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
