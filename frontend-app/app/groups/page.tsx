import { api } from "../utils/api";

export const dynamic = "force-dynamic";

async function getGroups() {
  try {
    const { data } = await api.get("/api/groups");
    return data;
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    return [];
  }
}

export default async function GroupsPage() {
  const groups = await getGroups();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Groups</h1>
      <ul className="list-disc ml-6">
        {groups.length > 0 ? (
          groups.map((group: any) => (
            <li key={group.id} className="text-lg">
              {group.name}
            </li>
          ))
        ) : (
          <p className="text-red-500">No groups found.</p>
        )}
      </ul>
    </div>
  );
}
