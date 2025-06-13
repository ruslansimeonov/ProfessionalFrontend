import { api, ApiResponse, handleApiError } from "./api";
import { getAuthToken } from "../tokenHelpers";

export interface InvitationCheckResponse {
  isValid: boolean;
  companyName?: string;
  remainingUses?: number;
  expiresAt?: string;
  message: string;
}

export interface CreateInvitationRequest {
  companyId: number;
  maxUses?: number;
  validForDays?: number;
}

export interface InvitationCode {
  id: number;
  invitationCode: string;
  companyId: number;
  maxUses: number;
  currentUses: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InvitationWithDetails extends InvitationCode {
  companyName: string;
  createdByName: string;
  usageCount: number;
  isExpired: boolean;
  isUsable: boolean;
}

/**
 * Check if an invitation code is valid (public endpoint)
 */
export async function checkInvitationCode(
  invitationCode: string
): Promise<ApiResponse<InvitationCheckResponse>> {
  try {
    const response = await api.post<InvitationCheckResponse>(
      "/api/public/company-invitations/check",
      { invitationCode }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Create a new invitation code (protected endpoint)
 */
export async function createInvitationCode(
  data: CreateInvitationRequest
): Promise<ApiResponse<{ invitation: InvitationCode }>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await api.post<{ invitation: InvitationCode }>(
      "/api/company-invitations",
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get all invitation codes for a company (protected endpoint)
 */
export async function getCompanyInvitations(
  companyId: number
): Promise<ApiResponse<InvitationWithDetails[]>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await api.get<{ invitations: InvitationWithDetails[] }>(
      `/api/company-invitations/company/${companyId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return {
      success: true,
      data: response.data.invitations,
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Deactivate an invitation code (protected endpoint)
 */
export async function deactivateInvitationCode(
  invitationId: number
): Promise<ApiResponse<{ invitation: InvitationCode }>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await api.put<{ invitation: InvitationCode }>(
      `/api/company-invitations/${invitationId}/deactivate`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
}
