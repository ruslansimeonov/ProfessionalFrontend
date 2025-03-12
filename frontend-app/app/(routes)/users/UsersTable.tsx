"use client"; // This makes the component a Client Component

import { useEffect, useState } from "react";
import { getUsers } from "@/app/utils/apis/api";
import { User } from "@/app/utils/types/types";

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      const response = await getUsers();
      if (response.success) {
        setUsers(response.data);
      } else {
        setError(response.error);
      }
    }

    fetchUsers();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (users.length === 0)
    return <p className="text-gray-500">No users found.</p>;

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">ID</th>
          <th className="border p-2">Name</th>
          <th className="border p-2">Email</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.details.id} className="text-center">
            <td className="border p-2">{user.details.id}</td>
            <td className="border p-2">
              {user.details.firstName} {user.details.lastName}
            </td>
            <td className="border p-2">{user.details.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
