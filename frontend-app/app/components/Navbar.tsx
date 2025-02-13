"use client";

import Link from "next/link";
import { useAuthStore } from "../store/zustandStore";

export default function Navbar() {
  const { isAuthenticated } = useAuthStore();

  return (
    <nav className="w-full bg-gray-800 p-4">
      <ul className="flex justify-center gap-6 text-white">
        <li>
          <Link href="/">🏠 Home</Link>
        </li>

        {isAuthenticated ? (
          <>
            <li>
              <Link href="/routes/users">👤 Users</Link>
            </li>
            <li>
              <Link href="/routes/companies">🏢 Companies</Link>
            </li>
            <li>
              <Link href="/routes/groups">👥 Groups</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/routes/login">🔑 Login</Link>
            </li>
            <li>
              <Link href="/routes/register">📝 Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
