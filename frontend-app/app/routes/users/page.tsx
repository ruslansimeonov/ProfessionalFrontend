import UsersTable from "./UsersTable"; // Import Client Component

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <UsersTable /> {/* Move API fetching logic to Client Component */}
    </div>
  );
}
