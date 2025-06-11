"use client";

import React, { useEffect, useState } from "react";

interface PageProps {
  params: Promise<{ id: string }>; // Updated for Next.js 15
}

const UserPage = ({ params }: PageProps) => {
  const [userId, setUserId] = useState<string | null>(null);

  // Resolve the async params
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setUserId(resolvedParams.id);
    };

    resolveParams();
  }, [params]);

  // Don't render anything until params are resolved
  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hello</h1>
      <p>User ID: {userId}</p>
    </div>
  );
};

export default UserPage;
