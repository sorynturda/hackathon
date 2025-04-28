import { NextResponse } from "next/server";

// Liste de căi publice
const publicPaths = ["/login", "/signup", "/", "/about", "/privacy-policy", "/terms"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Verifică dacă calea este publicăs
  const isPublicPath = publicPaths.some((path) => 
    pathname === path || pathname.startsWith("/api/")
  );

  // Exclude calea către modelele 3D și alte resurse statice
  if (pathname.startsWith("/models/") || 
      pathname.startsWith("/_next/") || 
      pathname.startsWith("/images/") ||
      pathname.startsWith("/svgs/") ||
      pathname.startsWith("/favicon.ico")) {
    return NextResponse.next();
  }

  // Get auth token from cookies
  const token = request.cookies.get("auth_token")?.value;
  
  // Dacă calea nu este publică și nu există token, redirecționează către login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Dacă utilizatorul este autentificat și încearcă să acceseze login/signup, redirecționează către home
  if (token && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configurează pe care căi să ruleze middleware-ul
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};