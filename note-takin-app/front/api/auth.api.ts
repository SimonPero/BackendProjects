import { cookies } from "next/headers";
import { AuthDto } from "@/types/dto/auth.dto";

class AuthApi {
  private baseUrl = process.env.API_URL;

  async logIn(email: string, password: string): Promise<AuthDto> {
    try {
      const res = await fetch(`${this.baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Login failed");
      }

      const setCookieHeader = res.headers.get("set-cookie");
      if (!setCookieHeader) {
        throw new Error("No authentication cookie received");
      }

      const cookieParts = setCookieHeader.split(";").map((part) => part.trim());
      const [cookieName, cookieValue] = cookieParts[0].split("=");

      // Decode the cookie value to remove URL encoding
      const decodedValue = decodeURIComponent(cookieValue);

      const maxAge = cookieParts
        .find((part) => part.toLowerCase().startsWith("max-age="))
        ?.split("=")[1];
      const secure = cookieParts.includes("Secure");
      const httpOnly = cookieParts.includes("HttpOnly");
      const sameSite = cookieParts
        .find((part) => part.toLowerCase().startsWith("samesite="))
        ?.split("=")[1];

      const cookieStore = await cookies();
      cookieStore.set(cookieName, decodedValue, {
        // Remove the extra "=" and use decoded value
        secure,
        httpOnly,
        sameSite:
          (sameSite?.toLowerCase() as "lax" | "strict" | "none") || "lax",
        maxAge: maxAge ? parseInt(maxAge) : undefined,
        path: "/",
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async logOut(): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`${this.baseUrl}/auth/logout`);
      const cookieStore = await cookies();
      cookieStore.delete("auth");
      return await res.json();
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }
}

export const authApi = new AuthApi();
