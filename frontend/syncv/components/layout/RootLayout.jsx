"use client";
import useLenis from "../../hooks/useLenis";

export default function RootLayout({ children }) {
  useLenis();

  return <div className="min-h-screen">{children}</div>;
}
