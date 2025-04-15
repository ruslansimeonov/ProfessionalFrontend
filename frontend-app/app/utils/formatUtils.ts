import { User } from "./types/types";

// Get the full name of a user
export const getFullName = (user: User): string => {
  return [
    user.details.firstName,
    user.details.middleName,
    user.details.lastName,
  ]
    .filter(Boolean)
    .join(" ");
};

// Format date for display
export const formatDate = (dateInput: string | Date): string => {
  try {
    const date =
      typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return new Intl.DateTimeFormat("bg-BG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (error: unknown) {
    console.error("Error formatting date:", error);
    return "Невалидна дата";
  }
};
