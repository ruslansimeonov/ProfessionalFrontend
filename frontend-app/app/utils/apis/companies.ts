import { getAuthToken } from "../tokenHelpers";
import { Company } from "../types/types";
import { api, ApiResponse, handleApiError } from "./api";

// ✅ Fetch all companies (requires authentication)
export async function getCompanies(): Promise<ApiResponse<Company[]>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "No token found" };
    }

    const { data } = await api.get<Company[]>("/api/companies", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data };
  } catch (error) {
    return handleApiError(error);
  }
}

// ✅ Create a new company (Admin only)
export async function createCompany(companyData: {
  companyName: string;
  taxNumber: string;
  address: string;
  MOL: string;
  phoneNumber: string;
  email: string;
}): Promise<ApiResponse<Company>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const { data } = await api.post<Company>("/api/companies", companyData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data };
  } catch (error) {
    return handleApiError(error);
  }
}

export interface CompanyRegistrationData {
  companyName: string;
  taxNumber: string;
  address: string;
  MOL: string;
  phoneNumber: string;
  email: string;
  contactPersonName: string;
}

// ✅ Register a new company (public access)
export async function registerCompany(
  companyData: CompanyRegistrationData
): Promise<ApiResponse<Company>> {
  try {
    const { data } = await api.post(
      "/api/public/companies/register",
      companyData
    );
    return { success: true, data };
  } catch (error) {
    return handleApiError(error);
  }
}
