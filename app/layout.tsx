import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers/ThemeProvider";
import AuthProvider from "./context/AuthProvider";
import Header from "@/app/components/header/Header";
import Footer from "@/app/components/footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Price Pulse - Track Prices Effortlessly",
  description:
    "Monitor product prices across multiple retailers and get notified when prices drop.",
  keywords:
    "price tracking, price monitor, price alerts, shopping, deals, discounts",
  icons: {
    icon: [
      { url: '/logo.png' },
      { url: '/icon.png' },
      { url: '/favicon.ico' },
    ],
    apple: '/assets/logo.png',
    shortcut: '/assets/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={process.env.NEXT_PUBLIC_ENV === 'production' ? '/price-pulse/logo.png' : '/logo.png'} />
        <link rel="apple-touch-icon" href={process.env.NEXT_PUBLIC_ENV === 'production' ? '/price-pulse/logo.png' : '/logo.png'} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-white dark:bg-gray-900`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
