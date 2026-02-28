import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Angela Liu — Design Portfolio",
  description:
    "Designer by trade, operator at heart. I ship reliable AI-enabled products that work in regulated, high-stakes environments.",
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
