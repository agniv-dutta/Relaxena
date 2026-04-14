import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Relaxena | Smart Venue Management",
  description: "Real-time crowd management and queue optimization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-white min-h-screen pb-32`}>
        <AuthProvider>
          <Header />
          <main className="pt-16 px-4 md:px-8 max-w-7xl mx-auto">
            {children}
          </main>
          <BottomNav />
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
