import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

const redirectUrl = (request: NextRequest, path: string) => {
  const url = request.nextUrl.clone();
  url.pathname = path;
  return NextResponse.redirect(url);
};

export async function middleware(request: NextRequest) {
  const requestedPath = request.nextUrl.pathname;

  // Define public routes
  const publicRoutes = ["/"];

  try {
    console.log("Middleware running");

    // Get session data
    const { response, user: AuthData } = await updateSession(request);
    const isAuthenticated = Boolean(AuthData?.data.user);

    if (!isAuthenticated) {
      console.log("User is not authenticated");
    }

    // If all checks pass, allow access
    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    if (requestedPath === "/error") {
      return NextResponse.next();
    }
    return redirectUrl(request, "/error");
  }
}

export const config = {
  matcher: [
    "/((?!public|api|test|noauth|unauthorized|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
