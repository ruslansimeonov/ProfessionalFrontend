import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ClientWrapper from "./components/ClientWrapper"; // ✅ Import ClientWrapper
import ClientProvider from "./components/ClientProvider"; // ✅ Import ClientProvider
import ClientContent from "./components/ClientContent"; // ✅ Import ClientContent

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Company Dashboard",
  description: "A simple Next.js app with SSR",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientWrapper>
          {" "}
          {/* ✅ This ensures `useDeviceContext()` works */}
          <ClientProvider /> {/* ✅ Updates `isDesktop` in Zustand */}
          <Navbar />
          <Sidebar />
          {/* ✅ Now ClientContent is inside the correct wrapper */}
          <ClientContent>{children}</ClientContent>
        </ClientWrapper>
      </body>
    </html>
  );
}
