"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster
        position="bottom-right"
        richColors
        toastOptions={{ duration: 5000, classNames: { toast: "rounded-lg" } }}
        closeButton
      />
    </ThemeProvider>
  );
} 