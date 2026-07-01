// Browser-side API base (points at the FastAPI backend).
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function googleLoginUrl(): string {
  return `${API_URL}/api/auth/google/login`;
}

type AuthBody = Record<string, string>;

async function post(path: string, body: AuthBody) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // send/receive the session cookie
    body: JSON.stringify(body),
  });
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    /* ignore */
  }
  if (!res.ok) {
    const message =
      (data && (data.detail || data.message)) || "Something went wrong. Please try again.";
    throw new Error(typeof message === "string" ? message : "Request failed");
  }
  return data;
}

export function login(email: string, password: string) {
  return post("/api/auth/login", { email, password });
}

export function register(fullName: string, email: string, password: string) {
  return post("/api/auth/register", { full_name: fullName, email, password });
}
