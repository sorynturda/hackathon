"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_URL = "http://localhost:5001";

// Create a simple auth context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const router = useRouter();

  // Check if we have a token stored on mount
  useEffect(() => {
    // This needs to run only in the browser
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("auth_token");
      if (storedToken) {
        // Also set the cookie for the middleware
        document.cookie = `auth_token=${storedToken}; path=/; max-age=86400`;
        setToken(storedToken);
        // Set a basic user object if we have a token
        setUser({ isLoggedIn: true });
      }
    }
  }, []);

  // Simple login function that directly calls your backend
  const login = async (email, password) => {
    setLoading(true);
    
    try {
      console.log("Attempting login with:", { email });
      
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });
      
      console.log("Login response:", response.data);
      
      // Try all possible token locations based on your JwtResponseDTO
      let receivedToken = null;
      
      if (response.data) {
        // Direct token at the top level
        if (response.data.token) {
          receivedToken = response.data.token;
        } 
        // Token inside a data property (common wrapper pattern)
        else if (response.data.data && response.data.data.token) {
          receivedToken = response.data.data.token;
        }
        // Just in case, try accessing the response directly (if it's a string)
        else if (typeof response.data === "string" && response.data.length > 20) {
          receivedToken = response.data;
        }
      }
      
      console.log("Extracted token:", receivedToken ? "Token found" : "No token found");
      
      if (receivedToken) {
        // Store token in localStorage and state
        localStorage.setItem("auth_token", receivedToken);
        document.cookie = `auth_token=${receivedToken}; path=/; max-age=86400`; // Set cookie for middleware
        setToken(receivedToken);
        
        // Set a simple user object
        setUser({ email, isLoggedIn: true });
        
        // Navigate to dashboard
        router.push("/dashboard");
        return true;
      } else {
        console.error("No token found in response:", response.data);
        throw new Error("No token received from server");
      }
    } catch (error) {
      console.error("Login error:", error.response || error);
      throw new Error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Simple register function
const register = async (username, email, password) => {
    setLoading(true);
    
    try {
      console.log("Attempting registration with:", { name: username, email });
      
      // Call your backend registration endpoint
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        name: username,
        email,
        password
      });
      
      console.log("Registration response:", response.data);
      
      // Instead of logging in automatically, redirect to login page
      router.push("/login?registered=true");
      
      // Return the response data
      return response.data;
    } catch (error) {
      console.error("Registration error:", error.response || error);
      
      // Extract error message with fallbacks
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.response?.data || 
        "Registration failed. Please try again.";
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Simple logout function
  const logout = () => {
    localStorage.removeItem("auth_token");
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;"; // Clear the cookie
    setToken(null);
    setUser(null);
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
        token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);