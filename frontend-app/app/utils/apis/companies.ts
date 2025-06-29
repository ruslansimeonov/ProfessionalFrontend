import { getAuthToken } from "../tokenHelpers";
import { Company } from "../types/types";
import { api, ApiResponse, handleApiError } from "./api";

/**
 * Get all companies (protected endpoint)
 */
export async function getCompanies(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ApiResponse<{ companies: Company[]; total: number }>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);

    console.log("API Call - URL:", `/api/companies?${queryParams.toString()}`);
    console.log("API Call - Headers:", {
      Authorization: `Bearer ${token.substring(0, 20)}...`,
    });

    const response = await api.get<{ companies: Company[]; total: number }>(
      `/api/companies?${queryParams.toString()}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("Raw API Response:", response.data);

    // Handle both possible response formats
    if (response.data) {
      // If the response is directly an array (like your backend returns)
      if (Array.isArray(response.data)) {
        return {
          success: true,
          data: {
            companies: response.data,
            total: response.data.length,
          },
        };
      }

      // If the response is an object with companies array
      if (response.data.companies) {
        return {
          success: true,
          data: response.data,
        };
      }

      // If the response data is the companies array itself
      return {
        success: true,
        data: {
          companies: (response.data as { companies: Company[]; total: number })
            .companies,
          total:
            (response.data as { companies: Company[]; total: number }).total ||
            (response.data as { companies: Company[]; total: number }).companies
              .length,
        },
      };
    }

    return {
      success: false,
      error: "Invalid response format",
    };
  } catch (error) {
    console.error("getCompanies API Error:", error);
    return handleApiError(error);
  }
}

/**
 * Get company by ID (protected endpoint)
 */
export async function getCompanyById(
  companyId: number
): Promise<ApiResponse<Company>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await api.get<Company>(`/api/companies/${companyId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      success: true,
      data: response.data,
    };
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

// Add this function to your existing companies.ts file

export async function searchCompanies(
  searchTerm: string
): Promise<ApiResponse<{ companies: Company[] }>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const { data } = await api.get<{ companies: Company[] }>(
      "/api/companies/search",
      {
        params: { q: searchTerm },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return { success: true, data };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get all pending companies (Admin only)
 */
export async function getPendingCompanies(): Promise<
  ApiResponse<{ companies: Company[]; total: number }>
> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const { data } = await api.get<{ companies: Company[]; total: number }>(
      "/api/companies/pending",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return { success: true, data };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Approve a pending company (Admin only)
 */
export async function approveCompany(companyId: number): Promise<
  ApiResponse<{
    success: boolean;
    message: string;
    company: Company;
  }>
> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const { data } = await api.put(
      `/api/companies/${companyId}/approve`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return { success: true, data };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Reject a pending company (Admin only)
 */
export async function rejectCompany(
  companyId: number,
  rejectionReason?: string
): Promise<
  ApiResponse<{
    success: boolean;
    message: string;
    company: Company;
    rejectionReason: string;
  }>
> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const { data } = await api.put(
      `/api/companies/${companyId}/reject`,
      { rejectionReason },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return { success: true, data };
  } catch (error) {
    return handleApiError(error);
  }
}
