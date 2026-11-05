import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { GameProvider } from "@/lib/game-context";
import { InviteProvider } from "@/lib/invite-context";
import { NotificationProvider } from "@/lib/notification-context";
import { ThemeProvider } from "next-themes";
import { MomentumBar } from "@/components/momentum-bar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Placemaker Tools",
  description: "Help us fix and improve places around the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-sans)] antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <GameProvider>
            <InviteProvider>
              <NotificationProvider>
                <MomentumBar />
                {children}
                <Toaster position="top-center" />
              </NotificationProvider>
            </InviteProvider>
          </GameProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
