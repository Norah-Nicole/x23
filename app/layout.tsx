import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; 

export const metadata: Metadata = {
  title: "Kijivuland",
  description: "A creative design agency aimed at making lasting memories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      
      <body className="min-h-full flex flex-col"> 
        <Navbar />
        {children}
         <Footer />
      </body>

     
    </html>
  );
}
