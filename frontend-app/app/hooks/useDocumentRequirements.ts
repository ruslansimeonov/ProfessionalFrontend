import { useState, useEffect } from "react";
import { api } from "../utils/apis/api";
import { Document } from "../utils/types/types";
import { getAuthToken } from "../utils/helpers";

interface DocumentRequirement {
  id: number;
  name: string;
  description: string;
}

interface MissingDocumentsResponse {
  hasAllRequiredDocuments: boolean;
  missingDocumentTypes: DocumentRequirement[];
  enrolledCourses: number[];
}

export function useDocumentRequirements(
  userId: number | undefined,
  userDocuments: Document[] = []
) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [missingRequirements, setMissingRequirements] = useState<
    DocumentRequirement[]
  >([]);
  const [hasAllRequiredDocuments, setHasAllRequiredDocuments] = useState(true);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<number[]>([]);

  // Fetch missing document requirements from the API
  useEffect(() => {
    const fetchMissingDocuments = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const token = getAuthToken();

        if (!token) {
          console.error("No authentication token found");
          setError("Authentication error. Please login again.");
          setLoading(false);
          return;
        }

        const response = await api.get<MissingDocumentsResponse>(
          `/api/documents/missing/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMissingRequirements(response.data.missingDocumentTypes);
        setHasAllRequiredDocuments(response.data.hasAllRequiredDocuments);
        setEnrolledCourseIds(response.data.enrolledCourses);
        setError(null);
      } catch (err) {
        console.error("Error fetching document requirements:", err);
        setError("Failed to load document requirements");
        setMissingRequirements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMissingDocuments();
  }, [userId, userDocuments.length]);

  const missingDocumentNames = missingRequirements.map((doc) => doc.name);

  return {
    loading,
    error,
    missingRequirements,
    missingDocumentNames,
    hasAllRequiredDocuments,
    enrolledCourseIds,
  };
}
