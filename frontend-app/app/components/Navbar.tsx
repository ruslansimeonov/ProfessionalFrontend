"use client";

import Link from "next/link";
import Image from "next/image";
import { useStore } from "../store/useStore";
import { IconButton } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

export default function Navbar() {
  const { toggleSidebar } = useStore();

  return (
    <nav
      className="w-full bg-gray-800 p-4 flex items-center justify-between"
      style={{
        position: "fixed", // ✅ Keeps navbar on top
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1300, // ✅ Ensures navbar is above the sidebar
      }}
    >
      {/* Left Section: Sidebar Toggle & Logo */}
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle Button */}
        <IconButton onClick={toggleSidebar} className="text-white">
          <MenuIcon />
        </IconButton>

        {/* Company Logo */}
        <Link href="/">
          <Image src="/next.svg" alt="Company Logo" width={120} height={40} />
        </Link>
      </div>

      {/* Center Section: Navigation Links */}
      <ul className="flex gap-6 text-white">
        <li>
          <Link href="/">🏠 Home</Link>
        </li>
        <li>
          <Link href="/routes/login">🔑 Login</Link>
        </li>
        <li>
          <Link href="/routes/register">📝 Register</Link>
        </li>
      </ul>
    </nav>
  );
}
