"use client"; // Mark as Client Component

import { useEffect, useState } from "react";
import { getGroups } from "@/app/utils/apis/api";
import { Group } from "@/app/utils/types";

export default function GroupsTable() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGroups() {
      const response = await getGroups();
      if (response.success) {
        setGroups(response.data);
      } else {
        setError(response.error);
      }
    }

    fetchGroups();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (groups.length === 0)
    return <p className="text-gray-500">No groups found.</p>;

  return (
    <ul className="list-disc ml-6">
      {groups.map((group) => (
        <li key={group.id} className="text-lg">
          {group.name}
        </li>
      ))}
    </ul>
  );
}
