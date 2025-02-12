import { Company } from "@/app/utils/types";
import { getCompanies } from "../../utils/api";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const response = await getCompanies(); // ✅ Now TypeScript understands the response
  const companies: Company[] = response.success ? response.data : []; // ✅ Handle errors gracefully
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Companies</h1>

      {/* ✅ Show error if API request failed */}
      {!response.success ? (
        <p className="text-red-500">{JSON.stringify(response.error)}</p>
      ) : response.data.length === 0 ? (
        <p className="text-gray-500">No companies found.</p>
      ) : (
        <ul className="list-disc ml-6">
          {companies.map((company: Company) => (
            <li key={company.id} className="text-lg">
              {company.companyName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
