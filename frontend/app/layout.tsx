import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { Shell } from "@/components/layout/Shell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ArenaFlow | Smart Venue Management",
  description: "Production-grade real-time crowd management and queue optimization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased overflow-x-hidden`}>
        <ClientProviders>
          <Shell>
            {children}
          </Shell>
        </ClientProviders>
      </body>
    </html>
  );
}
