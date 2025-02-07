import axios from "axios";

// Backend API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getUser(id: number) {
  const start = performance.now();

  const response = await fetch(`${API_BASE_URL}/api/users/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  const user = await response.json();

  const end = performance.now(); // Record the end time
  const duration = end - start; // Calculate how long it took

  console.log(`Fetching user ${id} took ${duration} ms.`);

  return user;
}
