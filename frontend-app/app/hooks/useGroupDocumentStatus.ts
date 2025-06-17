"use client";

import { useState, useCallback } from "react";
import { getGroupUsersWithDocumentStatus } from "@/app/utils/apis/groups";
import { User } from "@/app/utils/types/types";

interface DocumentStatusSummary {
  totalUsers: number;
  completeDocuments: number;
  incompleteDocuments: number;
  unknownDocuments: number;
  completionPercentage: number;
}

export function useGroupDocumentStatus() {
  const [users, setUsers] = useState<User[]>([]);
  const [summary, setSummary] = useState<DocumentStatusSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsersWithDocumentStatus = useCallback(async (groupId: number) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Loading users with document status for group:", groupId);

      const response = await getGroupUsersWithDocumentStatus(groupId);

      if (response.success && response.data) {
        // Extract both users and summary from the single response
        setUsers(response.data.users || []);
        setSummary(response.data.summary || null);

        console.log("Loaded users and summary:", {
          usersCount: response.data.users?.length || 0,
          summary: response.data.summary,
        });
      } else {
        setError("Failed to load group users");
        setUsers([]);
        setSummary(null);
      }
    } catch (err) {
      console.error("Error loading users with document status:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
      setUsers([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, []);
  const clearData = useCallback(() => {
    setUsers([]);
    setSummary(null);
    setError(null);
  }, []);

  return {
    users,
    summary,
    loading,
    error,
    loadUsersWithDocumentStatus,
    clearData,
  };
}
