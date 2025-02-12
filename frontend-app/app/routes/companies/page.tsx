import { Company } from "@/app/utils/types";
import { getCompanies } from "../../utils/api";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const companies: Company[] = await getCompanies();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Companies</h1>
      <ul className="list-disc ml-6">
        {companies.length > 0 ? (
          companies.map((company: Company) => (
            <li key={company.id} className="text-lg">
              {company.companyName}
            </li>
          ))
        ) : (
          <p className="text-red-500">No companies found.</p>
        )}
      </ul>
    </div>
  );
}
