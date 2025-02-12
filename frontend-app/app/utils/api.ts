import axios from "axios";

// Backend API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// export async function getUser(id: number) {
//   const start = performance.now();
//   console.log(api, "api url")
//   const { data } = await api.get(`/api/users/${id}`);
//   const end = performance.now();
//   console.log(`Fetching user ${id} took ${end - start} ms.`);
//   return data;
// }

export async function getUser(userId: number) {
  console.log(api.getUri(), "api url");

  const start = performance.now();
  const { data } = await api.get(`/api/users/${userId}`);
  const end = performance.now();
  console.log(`Fetching user ${userId} took ${end - start} ms.`);
  return data;
}
