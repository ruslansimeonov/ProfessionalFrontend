import { Group } from "@/app/utils/types";
import { getGroups } from "../../utils/api";

export const dynamic = "force-dynamic";

export default async function GroupsPage() {
  const groups: Group[] = await getGroups();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Groups</h1>
      <ul className="list-disc ml-6">
        {groups.length > 0 ? (
          groups.map((group) => (
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
