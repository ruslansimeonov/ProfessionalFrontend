import Image from "next/image";
import { getUser } from "./utils/api";

// app/page.tsx
export const dynamic = "force-dynamic";
// ^ Ensures fresh data on every request (disables Next caching).

export default async function Home() {
  // Parallel fetch: get both "/" message and user info at once.

  const [rootRes, userRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/`, { cache: "no-store" }),
    getUser(12),
  ]);

  console.log(userRes, "userRes");

  if (!rootRes || !userRes) {
    throw new Error("Failed to fetch data from the server.");
  }

  // Parse JSON responses
  const rootData = await rootRes.json(); // { message: "..." }
  // const user = await userRes.json; // { id: 2, name: "...", email: "..." }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center gap-10">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold mb-4">Welcome</h1>
        <p className="text-lg text-gray-700">
          {rootData?.message ?? "No message from server."}
        </p>
      </div>

      {/* User Information Section */}
      <div className="bg-black text-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          User Information
        </h1>
        {userRes ? (
          <div className="text-center">
            <Image
              src={userRes.pictureUrl}
              alt={`${userRes.name}'s profile picture`}
              className="w-24 h-24 rounded-full mx-auto mb-4"
              width={500}
              height={500}
            />
            <p className="text-xl font-semibold">{userRes.name}</p>
            <p className="text-gray-400">{userRes.email}</p>
          </div>
        ) : (
          <p className="text-red-500 text-center">User not found</p>
        )}
      </div>
    </div>
  );
}
