import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Layout from "@/components/layout/RootLayout";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SynCV",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">   
      <body 
        className={`${geistSans.variable} ${geistMono.variable} bg-white antialiased`}
      >
        <Providers>
          <Navbar />
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}