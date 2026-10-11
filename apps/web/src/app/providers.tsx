'use client';

import { querryClient } from "@/lib/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
    return(
        <QueryClientProvider
          client={querryClient}
        >
          <ThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem={true} 
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </QueryClientProvider>
    )
}