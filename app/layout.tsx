import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/components/layouts/app-sidebar";
import { AppHeader } from "@/app/components/layouts/app-header";
import { ThemeProvider } from "@/app/components/layouts/theme-provider";
import { Separator } from "@/components/ui/separator";

const interSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dev Tools",
  description: "Developer utilities and tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (      
  <html
      lang="en"
      className={`${interSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <TooltipProvider>
            <SidebarProvider>
              <div className="flex h-screen w-full overflow-hidden">
                <AppSidebar />
                <div className="flex flex-1 flex-col overflow-hidden">
                  <AppHeader />
                  <main className="flex-1 overflow-y-auto p-6">{children}</main>
                </div>
              </div>
            </SidebarProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
