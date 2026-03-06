import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import MobileNav from "@/components/mobile-nav";
import SplashScreen from "@/components/SplashScreen";

const lexendSans = Lexend({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const lexendMono = Lexend({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MKSUKO PROPERTY4U",
  description: "Real Estate Properties - ROOM, FLAT, PG, PLOT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${lexendSans.variable} ${lexendMono.variable} antialiased pb-16 lg:pb-0 pb-[env(safe-area-inset-bottom)]`}
      >
        <SplashScreen />
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
        <Header />
        {children}
        <MobileNav />
        <Footer />
      </body>
    </html>
  );
}
