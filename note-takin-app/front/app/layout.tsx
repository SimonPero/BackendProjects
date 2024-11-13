import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoteTaking",
  description: "created by simon pero",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
