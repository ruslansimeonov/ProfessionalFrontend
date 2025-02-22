"use client";

import Link from "next/link";
import Image from "next/image";
import { useStore } from "../store/useStore";
import { IconButton } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

export default function Navbar() {
  const { isAuthenticated, toggleSidebar, logout } = useStore();

  return (
    <nav
      className="w-full bg-gray-800 p-4 flex items-center justify-between"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1300,
      }}
    >
      {/* Left Section: Sidebar Toggle & Logo */}
      <div className="flex items-center gap-4">
        <IconButton onClick={toggleSidebar} className="text-white">
          <MenuIcon />
        </IconButton>

        <Link href="/">
          <Image src="/next.svg" alt="Company Logo" width={120} height={40} />
        </Link>
      </div>

      {/* Center Section: Navigation Links */}
      <ul className="flex gap-6 text-white">
        <li>
          <Link href="/">🏠 Home</Link>
        </li>
        {isAuthenticated ? (
          <>
            <li>
              <Link href="routes/profile">👤 Profile</Link>
            </li>
            <li>
              <button onClick={logout} className="text-red-400">
                🚪 Logout
              </button>
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
