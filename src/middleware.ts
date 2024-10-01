// middleware.ts
import { NextRequest, NextResponse } from "next/server";

interface CachedResponse {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CachedResponse>();
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

export async function middleware(request: NextRequest) {
  console.log(`[Middleware] Processing request for: ${request.url}`);

  // Only apply caching in development mode
  if (process.env.NODE_ENV == "development") {
    console.log("[Middleware] Not in development mode. Skipping cache.");
    return NextResponse.next();
  }

  // Only cache GET requests to API routes
  if (
    request.method !== "GET" ||
    !request.nextUrl.pathname.startsWith("/api/")
  ) {
    console.log("[Middleware] Not a GET request to API route. Skipping cache.");
    return NextResponse.next();
  }

  const cacheKey = request.nextUrl.href;
  console.log(`[Middleware] Cache key: ${cacheKey}`);

  const cachedResponse = cache.get(cacheKey);

  if (cachedResponse) {
    const { data, timestamp } = cachedResponse;
    const age = Date.now() - timestamp;
    console.log(`[Middleware] Found cached response. Age: ${age}ms`);

    if (age < CACHE_DURATION) {
      console.log("[Middleware] Serving cached response");
      return NextResponse.json(data);
    } else {
      console.log("[Middleware] Cached response expired");
    }
  } else {
    console.log("[Middleware] No cached response found");
  }

  // If cache miss or expired, fetch the response
  console.log("[Middleware] Fetching fresh response");
  const response = await fetch(request.url, {
    method: request.method,
    headers: request.headers,
  });

  // Clone the response so we can read the body
  const clonedResponse = response.clone();

  try {
    // Try to parse the response as JSON
    const data = await clonedResponse.json();

    // Cache the response
    console.log("[Middleware] Caching new response");
    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    // Return the response
    console.log("[Middleware] Returning fresh response");
    return NextResponse.json(data);
  } catch (error) {
    // If parsing as JSON fails, return the original response
    console.error("[Middleware] Failed to parse response as JSON:", error);
    console.log("[Middleware] Returning original response without caching");
    return new NextResponse(response.body, response);
  }
}

export const config = {
  matcher: "/api/:path*",
};
