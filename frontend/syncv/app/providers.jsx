"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "../context/AuthContext";

export default function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}
