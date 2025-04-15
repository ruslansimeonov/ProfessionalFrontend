import React from "react";

const UserPage = ({ params }: { params: { id: string } }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hello</h1>
      <p>User ID: {params.id}</p>
    </div>
  );
};

export default UserPage;
