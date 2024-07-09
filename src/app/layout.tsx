import type { Metadata } from "next";
import { Baskervville } from "next/font/google";
import "../styles/globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

import type { ReactNode } from "react";

type RootLayoutProps = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: "Age of Mythology Stats",
  description: "Created by FitzBro",
};

const baskervville = Baskervville({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: "400",
});

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning className="dark">
        <head />
        <body
          className={cn(
            "min-h-screen bg-background antialiased",
            baskervville.variable
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
