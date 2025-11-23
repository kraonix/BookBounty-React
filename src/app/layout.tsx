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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.variable} ${ubuntu.variable} antialiased min-h-screen flex flex-col`}>
        <Navbar />
        {/* Add spacing for fixed navbar (9vh approx 60-70px) + extra space requested */}
        <div className="h-[12vh]"></div>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
