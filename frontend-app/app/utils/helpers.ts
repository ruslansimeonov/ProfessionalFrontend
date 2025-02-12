export function getAuthToken(): string | null {
    if (typeof window === "undefined") {
      return null; // Prevent errors during SSR
    }
  
    const token = localStorage.getItem("token");
    return token ? token : null;
  }
  