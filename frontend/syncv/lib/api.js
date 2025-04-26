"use client";

import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5001";

// Create a custom hook to get the API client with authentication
export function useApiClient() {
  const router = useRouter();
  
  const getApiClient = async () => {
    const session = await getSession();
    
    const apiClient = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    // Request interceptor to add auth token
    apiClient.interceptors.request.use(async (config) => {
      if (session?.accessToken) {
        config.headers.Authorization = `${session.tokenType} ${session.accessToken}`;
      }
      return config;
    });
    
    // Response interceptor to handle token expiration
    apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        // If unauthorized error and not a retry
        if (error.response?.status === 401 && !error.config._retry) {
          error.config._retry = true;
          
          // Session expired, log out and redirect to login
          await signOut({ redirect: false });
          router.push("/login");
        }
        
        return Promise.reject(error);
      }
    );
    
    return apiClient;
  };
  
  return { getApiClient };
}

// Example of a hook to use for a specific API feature
export function useUserApi() {
  const { getApiClient } = useApiClient();
  
  const getUserProfile = async () => {
    const api = await getApiClient();
    return api.get("/api/users/profile");
  };
  
  const updateUserProfile = async (data) => {
    const api = await getApiClient();
    return api.put("/api/users/profile", data);
  };
  
  return {
    getUserProfile,
    updateUserProfile,
  };
}

// You can create more API hooks for different features