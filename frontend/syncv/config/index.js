// Configuration settings for the application

const config = {
    // API settings
    api: {
      baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001",
      endpoints: {
        auth: {
          login: "/api/auth/login",
          register: "/api/auth/register",
          refresh: "/api/auth/refresh-token",
        },
        user: {
          profile: "/api/users/profile",
          update: "/api/users/profile",
        },
        // Add other API endpoints as needed
      },
    },
    
    // Authentication settings
    auth: {
      tokenKey: "auth_token", // For local storage token key (if needed)
      tokenType: "Bearer", // Default token type
      sessionMaxAge: 24 * 60 * 60, // 24 hours in seconds
    },
    
    // Route settings
    routes: {
      public: ["/", "/about", "/login", "/signup"],
      authCallbackUrl: "/dashboard",
      loginUrl: "/login",
    },
  };
  
  export default config;