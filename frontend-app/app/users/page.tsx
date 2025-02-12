import { getUsers } from "../utils/api";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user: any) => (
              <tr key={user.id} className="text-center">
                <td className="border p-2">{user.id}</td>
                <td className="border p-2">
                  {user.firstName} {user.lastName}
                </td>
                <td className="border p-2">{user.email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center p-4 text-red-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
