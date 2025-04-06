import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ClientWrapper from "./components/ClientWrapper";
import ClientProvider from "./components/ClientProvider";
import ClientContent from "./components/ClientContent";
import I18nProvider from "./i18n"; // Import the I18nProvider component

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
    <html lang="bg">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider>
          <ClientWrapper>
            <ClientProvider />
            <Navbar />
            <Sidebar />
            <ClientContent>{children}</ClientContent>
          </ClientWrapper>
        </I18nProvider>
      </body>
    </html>
  );
}
