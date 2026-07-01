import { cookies } from "next/headers";

// Server-side backend base URL (Next.js server → FastAPI).
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type CurrentUser = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
};

/** Reads the session cookie and asks the backend who the user is. Returns null if not authed. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieHeader = (await cookies()).toString();
  if (!cookieHeader) return null;
  try {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as CurrentUser;
  } catch {
    return null;
  }
}
