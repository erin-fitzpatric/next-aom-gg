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
import { Separator } from "@/components/ui/separator";

type RootLayoutProps = {
  children: ReactNode;
};

export const metadata = {
  title: "Home - AoM.gg",
  description:
    "AoM.gg is your home for Age of Mythology Retold leaderboards, stats, recorded games, and more. Built by FitzBro for the AoM Retold community.",
  openGraph: {
    title: "Home - AoM.gg",
    description:
      "AoM.gg is your home for Age of Mythology Retold leaderboards, stats, recorded games, and more. Built by FitzBro for the AoM Retold community.",
    url: "https://www.aom.gg/",
    images: [
      {
        url: "/aom-gg-logo.png",
        width: 1200,
        height: 630,
        alt: "AOM GG Logo",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning className="dark">
        <body className={cn("min-h-screen bg-background antialiased")}>
          <SessionProvider>
            <TooltipProvider delayDuration={75}>
              <WindowProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="dark"
                  disableTransitionOnChange
                >
                  <Header />
                  <Separator />
                  <main>{children}</main>
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
