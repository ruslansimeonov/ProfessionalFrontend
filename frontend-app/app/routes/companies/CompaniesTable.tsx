"use client"; // Mark as Client Component

import { useEffect, useState } from "react";
import { getCompanies } from "@/app/utils/apis/api";
import { Company } from "@/app/utils/types/types";

export default function CompaniesTable() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompanies() {
      const response = await getCompanies();
      if (response.success) {
        setCompanies(response.data);
      } else {
        setError(response.error);
      }
    }

    fetchCompanies();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (companies.length === 0)
    return <p className="text-gray-500">No companies found.</p>;

  return (
    <ul className="list-disc ml-6">
      {companies.map((company) => (
        <li key={company.id} className="text-lg">
          {company.companyName}
        </li>
      ))}
    </ul>
  );
}
