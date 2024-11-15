import { AuthDto } from "@/types/dto/auth.dto";

class AuthApi {
  async logIn(email: string, password: string): Promise<AuthDto> {
    const user = { email, password };
    const res = await fetch(`${process.env.API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const data = await res.json();
    return data;
  }
  async logOut(): Promise<{ success: boolean }> {
    const res = await fetch(`${process.env.API_URL}/auth/logout`);
    const data = await res.json();
    return data;
  }
}

export const authApi = new AuthApi();
