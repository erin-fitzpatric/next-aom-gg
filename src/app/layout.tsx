import "../styles/globals.css";
import { cn } from "@/utils/utils";
import { ThemeProvider } from "@/components/provider/theme-provider";

import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
import { WindowProvider } from "@/components/provider/window-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning className="dark">
        <head />
        <body className={cn("min-h-screen bg-background antialiased p-4")}>
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
              </ThemeProvider>
            </WindowProvider>
          </TooltipProvider>
        </body>
      </html>
    </>
  );
}
