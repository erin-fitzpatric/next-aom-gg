import "../styles/globals.css";
import { cn } from "@/utils/utils";
import { ThemeProvider } from "@/components/provider/theme-provider";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
import Footer from "@/components/footer"; // Import the Footer component
import { WindowProvider } from "@/components/provider/window-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoogleAdsense from "@/components/googleAdsense";

type RootLayoutProps = {
  children: ReactNode;
};

export const metadata = {
  title: "Home - AoM.gg",
  description:
    "AoM.gg is your home for Age of Mythology Retold leaderboards, stats, recorded games, and more. Built by FitzBro for the AoM Retold community.",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning className="dark">
        <body className={cn("min-h-screen bg-background antialiased p-4")}>
          <SessionProvider>
            <TooltipProvider delayDuration={75}>
              <WindowProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="dark"
                  disableTransitionOnChange
                >
                  <Header />
                  {children}
                  <Toaster />
                  <Footer />
                </ThemeProvider>
              </WindowProvider>
            </TooltipProvider>
          </SessionProvider>
          <Analytics />
          <SpeedInsights />
        </body>
        <GoogleAdsense />
      </html>
    </>
  );
}
