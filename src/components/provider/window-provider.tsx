"use client";
import { createContext, useEffect, useState } from "react";

type WindowSize = {
  width: number;
  height: number;
};

export const WindowContext = createContext<WindowSize | undefined>(undefined);

export const WindowProvider = ({ children }: { children: React.ReactNode }) => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <WindowContext.Provider value={windowSize}>{children}</WindowContext.Provider>
  );
};