import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch user data
export async function getUser(userId: number) {
  try {
    const { data } = await api.get(`/api/users/${userId}`);
    return data;
  } catch (error) {
    console.error(`Failed to fetch user ${userId}:`, error);
    return null;
  }
}

// Fetch server message
export async function getServerMessage() {
  try {
    const { data } = await api.get("/");
    return data.message;
  } catch (error) {
    console.error("Failed to fetch server message:", error);
    return "Error fetching message.";
  }
}

// Fetch all users
export async function getUsers() {
  try {
    const { data } = await api.get("/api/users");
    return data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}

export async function getCompanies() {
  try {
    const { data } = await api.get("/api/companies");
    return data;
  } catch (error) {
    console.error("Failed to fetch companies:", error);
    return [];
  }
}

export async function getGroups() {
  try {
    const { data } = await api.get("/api/groups");
    return data;
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    return [];
  }
}