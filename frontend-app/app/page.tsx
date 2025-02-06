"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState<string>("Loading...");

  // Fetch API data on component mount
  useEffect(() => {
    fetch("http://localhost:5000/api/hello") // Replace with backend URL
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Failed to load content."));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome</h1>
      <p className="text-lg text-gray-700">{message}</p>
    </div>
  );
}
