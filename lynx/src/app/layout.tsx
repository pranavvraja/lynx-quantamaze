import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar/navbar";

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
  title: "CliniQ",
  description: "Book clinic appointments easily. Register your clinic or schedule visits quickly and securely.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased lg:mx-44 sm:mx-10 mx-5 bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <Navbar />
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
              {children}
            </div>
            <hr className="border-gray-300 w-full" />
            <footer className="flex items-center justify-center w-full h-16 text-white">
              <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
            </footer>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
