// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const API_URL = "http://localhost:5001";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Make a request to your backend API for authentication
          const response = await axios.post(`${API_URL}/api/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          // Log the response for debugging
          console.log("Login response data:", response.data);

          if (response.data) {
            // Return a standardized user object
            return {
              id: credentials.email,
              email: credentials.email,
              accessToken: response.data.token || (response.data.data && response.data.data.token),
            };
          }
          return null;
        } catch (error) {
          console.error("Authentication error:", error.response?.data || error.message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken;
        if (session.user) {
          session.user.email = token.email;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET || "your-default-secret-key",
  debug: true, // Enable debug mode to see detailed logs
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };