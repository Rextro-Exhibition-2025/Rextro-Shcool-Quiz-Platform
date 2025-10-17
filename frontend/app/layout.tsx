"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar/NavBar";
import Footer from "@/components/Footer/Footer";
import Providers from "@/components/Providers";
import { usePathname } from "next/navigation";
import { UserProvider } from '@/contexts/UserContext';
import { QuizProvider } from "@/contexts/QuizContext";


const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavAndFooter = pathname.startsWith("/quiz");
  return (
    <html lang="en">
  <body className={`${poppins.variable} antialiased`}>
        <Providers>
          <UserProvider>
            <QuizProvider>
              {!hideNavAndFooter && <NavBar />}
              {children}
              {!hideNavAndFooter && <Footer />}
            </QuizProvider>
          </UserProvider>
        </Providers>
      </body>
    </html>
  );
}
