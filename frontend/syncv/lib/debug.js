"use client";

import { getSession } from "next-auth/react";

export async function checkAuthStatus() {
  try {
    const session = await getSession();
    console.log("Current session:", session);
    
    if (session?.accessToken) {
      console.log("Token exists:", {
        tokenPreview: `${session.accessToken.substring(0, 20)}...`,
        tokenType: session.tokenType,
        user: session.user
      });
      return true;
    } else {
      console.log("No valid token found in session");
      return false;
    }
  } catch (error) {
    console.error("Error checking auth status:", error);
    return false;
  }
}

export function createDebugInterceptor(axiosInstance) {
  axiosInstance.interceptors.request.use(
    (config) => {
      console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data
      });
      return config;
    },
    (error) => {
      console.error("❌ Request Error:", error);
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      console.log(`✅ API Response: ${response.status} from ${response.config.url}`, {
        data: response.data
      });
      return response;
    },
    (error) => {
      console.error("❌ Response Error:", {
        status: error.response?.status,
        url: error.config?.url,
        message: error.response?.data || error.message
      });
      return Promise.reject(error);
    }
  );

  return axiosInstance;
}