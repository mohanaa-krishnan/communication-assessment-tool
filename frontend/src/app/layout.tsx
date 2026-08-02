import type { Metadata } from "next";
import ClientLayout from "@/components/ClientLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "CAT — Communication Assessment Tool",
  description: "AI-assisted communication assessment platform for SLPs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <body className="antialiased bg-slate-50 text-slate-900">
  <ClientLayout>
    {children}
  </ClientLayout>
</body>
    </html>
  );
}