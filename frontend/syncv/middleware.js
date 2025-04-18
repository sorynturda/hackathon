import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// List of paths that should be accessible without authentication
const publicPaths = ["/login", "/signup", "/", "/about"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if the path should be accessible without authentication
  const isPublicPath = publicPaths.some((path) => 
    pathname === path || pathname.startsWith("/api/auth/")
  );

  // Get the session token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "your-default-secret-key"
  });
  
  // If the path is not public and there's no token, redirect to login
  if (!isPublicPath && !token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(pathname));
    return NextResponse.redirect(url);
  }

  // If the user is authenticated and tries to access login/signup, redirect to home
  if (token && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Apply to all paths except static files, images, api routes except auth ones
   "/((?!_next/static|_next/image|favicon.ico|images|svgs|logo|models|api/(?!auth)).*)",
  ],
};