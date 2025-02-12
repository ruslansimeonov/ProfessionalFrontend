import GroupsTable from "./GroupsTable"; // Import Client Component

export const dynamic = "force-dynamic"; // Ensures fresh data

export default async function GroupsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Groups</h1>
      <GroupsTable /> {/* Move API fetching logic to a Client Component */}
    </div>
  );
}
