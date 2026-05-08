import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import ScannerNav from "@/components/layout/ScannerNav";

export const metadata: Metadata = {
  title: "SignalLens - NSE Swing Research Dashboard",
  description:
    "Educational NSE swing trading research platform with scanners, market insights, proof tracking, and pattern guides.",
  keywords: ["NSE", "swing research", "scanner dashboard", "market breadth"],
  openGraph: {
    title: "SignalLens",
    description: "Original NSE swing-trading research workspace for educational use only.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <ScannerNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
