import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-gray-800 p-4">
      <ul className="flex justify-center gap-6 text-white">
        <li>
          <Link href="/">🏠 Home</Link>
        </li>
        <li>
          <Link href="/users">👤 Users</Link>
        </li>
        <li>
          <Link href="/companies">🏢 Companies</Link>
        </li>
        <li>
          <Link href="/groups">👥 Groups</Link>
        </li>
      </ul>
    </nav>
  );
}
