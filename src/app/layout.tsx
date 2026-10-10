import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Codingo — Le Duolingo du Code",
  description: "Apprenez le HTML, le CSS et la programmation étape par étape avec des leçons courtes, des défis gamifiés et un tuteur IA bienveillant.",
  keywords: ["apprendre à coder", "html", "css", "duolingo du code", "formation programmation", "cours interactif"],
  authors: [{ name: "Codingo" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#4CC2FF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-[#0B3A5B] font-sans selection:bg-[#4CC2FF] selection:text-[#0B3A5B]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
