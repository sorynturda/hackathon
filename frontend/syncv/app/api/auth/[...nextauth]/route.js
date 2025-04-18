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
         
          const response = await axios.post(`${API_URL}/api/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          if (response.data && response.data.data.token) {
            return {
              id: credentials.email,
              email: credentials.email,
              token: response.data.data.token,
              tokenType: response.data.data.type,
            };
          }
          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.tokenType = user.tokenType;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.tokenType = token.tokenType;
      session.user.email = token.email;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signUp: "/signup",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, 
  },
  secret: process.env.NEXTAUTH_SECRET || "your-default-secret-key",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };