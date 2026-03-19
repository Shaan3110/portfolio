import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Suchintan Das | Software Test Engineer - Manual & Automation Testing",
  description:
    "Portfolio of Suchintan Das, a Software Test Engineer specializing in manual and automation testing with expertise in Selenium, Playwright, API testing, and cross-platform test automation.",
  keywords: [
    "Software Test Engineer",
    "Manual Testing",
    "Automation Testing",
    "Selenium",
    "Playwright",
    "API Testing",
    "Test Automation",
    "QA Engineer",
    "Suchintan Das",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <head>
        {/* Fallback: ensure content is visible if JS/Framer Motion is unavailable (Req 11.5) */}
        <noscript>
          <style>{`
            [style*="opacity: 0"], [style*="opacity:0"] {
              opacity: 1 !important;
              transform: none !important;
            }
          `}</style>
        </noscript>
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
