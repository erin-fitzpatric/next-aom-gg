import type { Metadata } from "next";
import { Roboto_Slab as CrimsonPro } from "next/font/google";
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

const crimsonPro = CrimsonPro({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: "400",
});

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            crimsonPro.variable
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
