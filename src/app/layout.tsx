import { ClerkProvider } from "@clerk/nextjs";
import { UIProvider } from "@yamada-ui/react";
import type { Metadata } from "next";
import "./globals.css";
import { AppStateProvider } from "@/components/app-state";

export const metadata: Metadata = {
  title: "outfiter. — Your style, your story",
  description: "Споделяй аутфити и създай дигитален гардероб.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bg">
      <body>
        <ClerkProvider>
          <UIProvider><AppStateProvider>{children}</AppStateProvider></UIProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
