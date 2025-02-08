"use client"; // ✅ Correctly marks this as a client component

import { useEffect, useState } from "react";
import { getUser } from "./api/api";

export default function Home() {
  const [message, setMessage] = useState<string>("Loading...");
  const [user, setUser] = useState<{
    id: number;
    name: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Failed to load content."));

    getUser(2)
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center gap-10">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold mb-4">Welcome</h1>
        <p className="text-lg text-gray-700">{message}</p>
      </div>

      {/* User Information Section */}
      <div className="bg-black text-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          User Information
        </h1>
        {loading ? (
          <p className="text-lg text-center">Loading...</p>
        ) : user ? (
          <div className="text-center">
            <p className="text-xl font-semibold">{user.name}</p>
            <p className="text-gray-400">{user.email}</p>
          </div>
        ) : (
          <p className="text-red-500 text-center">User not found</p>
        )}
      </div>
    </div>
  );
}
