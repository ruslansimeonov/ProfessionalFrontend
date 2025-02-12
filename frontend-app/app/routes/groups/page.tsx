import { Group } from "@/app/utils/types";
import { getGroups } from "../../utils/api";

export const dynamic = "force-dynamic";

export default async function GroupsPage() {
  const response = await getGroups(); // ✅ Get full response
  const groups: Group[] = response.success ? response.data : []; // ✅ Handle errors gracefully

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Groups</h1>

      {/* ✅ Display error message as a string */}
      {!response.success ? (
        <p className="text-red-500">{JSON.stringify(response.error)}</p>
      ) : groups.length === 0 ? (
        <p className="text-gray-500">No groups found.</p>
      ) : (
        <ul className="list-disc ml-6">
          {groups.map((group) => (
            <li key={group.id} className="text-lg">
              {group.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
