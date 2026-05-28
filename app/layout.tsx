import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BaseName Commerce",
  description: "Turn basenames into AI-readable storefronts with Base checkout.",
  other: {
    "talentapp:project_verification":
      "589a420236bc691efb82927fc649f1b30901697890e3e6a0a5b0d42aa825ae9f37ba7148c2697b79872792c12ba2f2e9d548c44f36f57569fef7ba320d01725e",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
