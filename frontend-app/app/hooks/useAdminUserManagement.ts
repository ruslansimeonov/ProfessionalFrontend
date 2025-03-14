import { useState } from "react";
import { User } from "@/app/utils/types/types";
import { getAuthToken } from "@/app/utils/helpers";

export function useAdminUserManagement(userId: string | number) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  // Update user profile data
  const updateUserProfile = async (userData: Partial<User>) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${baseUrl}/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      const data = await response.json();
      setSuccess("User profile updated successfully");
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update user profile";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a user document
  const deleteUserDocument = async (documentId: string | number) => {
    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${baseUrl}/api/admin/documents/${documentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      setSuccess("Document deleted successfully");
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete document";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Upload documents on behalf of a user
  const uploadUserDocument = async (file: File, docTypeName: string) => {
    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId.toString());
      formData.append("docTypeName", docTypeName);

      const response = await fetch(`${baseUrl}/api/admin/documents/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      const data = await response.json();
      setSuccess("Document uploaded successfully");
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload document";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset status messages
  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    loading,
    error,
    success,
    updateUserProfile,
    deleteUserDocument,
    uploadUserDocument,
    resetMessages,
  };
}
