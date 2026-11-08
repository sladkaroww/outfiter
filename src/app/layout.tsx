import { ClerkProvider } from "@clerk/nextjs";
import { UIProvider } from "@yamada-ui/react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "outfiter. — Your style, your story",
  description: "Споделяй аутфити и създай дигитален гардероб.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bg">
      <body>
        <ClerkProvider>
          <UIProvider>{children}</UIProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
