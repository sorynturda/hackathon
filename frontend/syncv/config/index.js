
const config = {
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
      },
    },
    
    auth: {
      tokenKey: "auth_token", 
      tokenType: "Bearer",
      sessionMaxAge: 24 * 60 * 60,
    },
    
    routes: {
      public: ["/", "/about", "/login", "/signup"],
      authCallbackUrl: "/dashboard",
      loginUrl: "/login",
    },
  };
  
  export default config;