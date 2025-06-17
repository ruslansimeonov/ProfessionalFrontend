"use client";

import { useState, useCallback, useEffect } from "react";
import {
  getPendingCompanies,
  approveCompany,
  rejectCompany,
} from "@/app/utils/apis/companies";
import { Company } from "@/app/utils/types/types";

export function usePendingCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<{
    [key: number]: boolean;
  }>({});

  const loadPendingCompanies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getPendingCompanies();

      if (response.success && response.data) {
        setCompanies(response.data.companies || []);
      } else {
        setError(response.error || "Failed to load pending companies");
        setCompanies([]);
      }
    } catch (err) {
      console.error("Error loading pending companies:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load pending companies"
      );
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleApproveCompany = useCallback(async (companyId: number) => {
    try {
      setActionLoading((prev) => ({ ...prev, [companyId]: true }));
      setError(null);

      const response = await approveCompany(companyId);

      if (response.success) {
        // Remove the approved company from pending list
        setCompanies((prev) =>
          prev.filter((company) => company.id !== companyId)
        );
        return { success: true, message: response.data.message };
      } else {
        setError(response.error || "Failed to approve company");
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to approve company";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setActionLoading((prev) => ({ ...prev, [companyId]: false }));
    }
  }, []);

  const handleRejectCompany = useCallback(
    async (companyId: number, reason?: string) => {
      try {
        setActionLoading((prev) => ({ ...prev, [companyId]: true }));
        setError(null);

        const response = await rejectCompany(companyId, reason);

        if (response.success) {
          // Remove the rejected company from pending list
          setCompanies((prev) =>
            prev.filter((company) => company.id !== companyId)
          );
          return { success: true, message: response.data.message };
        } else {
          setError(response.error || "Failed to reject company");
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to reject company";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setActionLoading((prev) => ({ ...prev, [companyId]: false }));
      }
    },
    []
  );

  const refresh = useCallback(() => {
    loadPendingCompanies();
  }, [loadPendingCompanies]);

  return {
    companies,
    loading,
    error,
    actionLoading,
    loadPendingCompanies,
    handleApproveCompany,
    handleRejectCompany,
    refresh,
  };
}
