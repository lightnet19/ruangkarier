import type { Metadata } from "next";
import "./globals.css";
import { Navbar, Footer } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "RuangKarier — Career Self-Defense Portal",
  description: "Web App bimbingan karier digital adaptif berbasis strategi kognitif (CBT) dan RIASEC Holland untuk siswa SMA/MA/SMK.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="flex flex-col min-h-screen antialiased bg-bg-warm">
        <Navbar />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
