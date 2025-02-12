import { User } from "@/app/utils/types";
import { getUsers } from "../../utils/api";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const response = await getUsers(); // ✅ Get full response
  const users: User[] = response.success ? response.data : []; // ✅ Handle errors gracefully

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      {/* ✅ Display error message if API request failed */}
      {!response.success ? (
        <p className="text-red-500">{JSON.stringify(response.error)}</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
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
              <tr key={user.id} className="text-center">
                <td className="border p-2">{user.id}</td>
                <td className="border p-2">
                  {user.firstName} {user.lastName}
                </td>
                <td className="border p-2">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
