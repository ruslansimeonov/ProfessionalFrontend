import CompaniesTable from "./CompaniesTable";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Companies</h1>
      <CompaniesTable /> {/* Move API fetching logic to a Client Component */}
    </div>
  );
}
