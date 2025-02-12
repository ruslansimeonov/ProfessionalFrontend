import { api } from "../utils/api";

export const dynamic = "force-dynamic";

async function getCompanies() {
  try {
    const { data } = await api.get("/api/companies");
    return data;
  } catch (error) {
    console.error("Failed to fetch companies:", error);
    return [];
  }
}

export default async function CompaniesPage() {
  const companies = await getCompanies();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Companies</h1>
      <ul className="list-disc ml-6">
        {companies.length > 0 ? (
          companies.map((company: any) => (
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
