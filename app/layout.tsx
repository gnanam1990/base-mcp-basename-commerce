import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BaseName Commerce",
  description: "Turn basenames into AI-readable storefronts with Base checkout.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
