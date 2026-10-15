import { NextResponse, type NextRequest } from "next/server";
import { projects } from "@/content/projects";

const knownSlugs = new Set(projects.map((project) => project.slug));

/**
 * Project pages stream from a prerendered shell, so a notFound() inside the
 * page would arrive after a 200 status. Checking the slug here, before
 * rendering starts, gives unknown project URLs a real 404.
 */
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (slug && !knownSlugs.has(slug)) {
    return NextResponse.rewrite(new URL("/404", request.url), { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/work/:slug",
};
