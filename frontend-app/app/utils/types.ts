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
