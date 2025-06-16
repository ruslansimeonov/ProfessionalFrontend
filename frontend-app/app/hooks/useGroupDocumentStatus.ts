import { useState, useCallback } from "react";
import {
  getGroupUsersWithDocumentStatus,
  getGroupDocumentStatusSummary,
} from "@/app/utils/apis/groups";
import { User } from "@/app/utils/types/types";

interface DocumentStatusSummary {
  totalUsers: number;
  completeDocuments: number;
  incompleteDocuments: number;
  unknownDocuments: number;
  completionPercentage: number;
}

export function useGroupDocumentStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [summary, setSummary] = useState<DocumentStatusSummary | null>(null);

  const loadUsersWithDocumentStatus = useCallback(async (groupId: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getGroupUsersWithDocumentStatus(groupId);

      if (response.success) {
        setUsers(response.data.users);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load users with document status"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDocumentStatusSummary = useCallback(async (groupId: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getGroupDocumentStatusSummary(groupId);

      if (response.success) {
        setSummary(response.data.summary);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load document status summary"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    users,
    summary,
    loadUsersWithDocumentStatus,
    loadDocumentStatusSummary,
  };
}
