"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "An authentication error occurred";

  if (error === "CredentialsSignin") {
    errorMessage = "Invalid email or password";
  } else if (error === "AccessDenied") {
    errorMessage =
      "Access denied. You do not have permission to access this resource";
  } else if (error === "CallbackRouteError") {
    errorMessage = "There was a problem with the login callback";
  } else if (error) {
    errorMessage = error;
  }

  return (
    <div className="max-w-md w-full px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-red"
      >
        <h1 className="h3 text-black mb-4">Authentication Error</h1>

        <div className="body text-black mb-6">{errorMessage}</div>

        <div className="flex flex-col space-y-3">
          <Link
            href="/login"
            className="bg-black text-white body py-3 text-center hover:bg-accent hover:text-black transition-colors duration-300"
          >
            Back to Login
          </Link>

          <Link
            href="/"
            className="body text-black text-center hover:text-accent transition-colors duration-300"
          >
            Return to Homepage
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

const AuthError = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Suspense fallback={<div className="body">Loading...</div>}>
        <ErrorContent />
      </Suspense>
    </div>
  );
};

export default AuthError;
