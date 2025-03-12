import { getServerMessage } from "./utils/apis/api";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  let serverMessage = "No message from server.";
  try {
    const response = await getServerMessage();
    if (response.success) {
      serverMessage = response.data;
    } else {
      console.error("Failed to fetch server message:", response.error);
    }
  } catch (error) {
    console.error("Failed to fetch server message:", error);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
      <p className="text-lg text-gray-700">{serverMessage}</p>
      <div className="flex gap-4">
        <Link
          href="/users"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          View Users
        </Link>
        <Link
          href="/companies"
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          View Companies
        </Link>
      </div>
    </div>
  );
}
