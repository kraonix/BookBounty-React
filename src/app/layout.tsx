import type { Metadata } from "next";
import { Lato, Ubuntu } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/features/navbar/components/Navbar";
import { Footer } from "@/features/footer/components/Footer";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
});

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ubuntu",
});

export const metadata: Metadata = {
  title: "BookBounty",
  description: "Your digital sanctuary for books",
};

import { AuthProvider } from "@/features/auth/components/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lato.variable} ${ubuntu.variable} antialiased`}
      >
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
