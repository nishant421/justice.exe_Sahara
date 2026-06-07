import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sahara | सहारा — हर आवाज़ को न्याय मिले",
  description:
    "AI-powered trauma-informed legal first responder for POCSO and POSH survivors in India.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
