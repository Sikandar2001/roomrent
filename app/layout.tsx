import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import MobileNav from "@/components/mobile-nav";
import SplashScreen from "@/components/SplashScreen";

const lexend = Lexend({
  variable: "--font-lexend",
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
        className={`${lexend.variable} font-lexend antialiased pb-16 lg:pb-0 pb-[env(safe-area-inset-bottom)]`}
      >
        <Suspense fallback={null}>
          <SplashScreen />
        </Suspense>
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
        <Header />
        <Suspense fallback={null}>
          {children}
        </Suspense>
        <MobileNav />
        <Footer />
      </body>
    </html>
  );
}
