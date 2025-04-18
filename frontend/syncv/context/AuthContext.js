"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    }
  }, [session, status]);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }
      
      // Navigate to dashboard on successful login
      router.push("/dashboard");
      return result;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (username, email, password) => {
    setLoading(true);
    
    try {
      // Use our custom API route for registration
      const response = await axios.post('/api/register', {
        username,
        email,
        password,
      });

      if (response.data) {
        // After successful registration, log the user in
        return await login(email, password);
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);