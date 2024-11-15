"use server";

import { authApi } from "@/api/auth.api";
import { usersApi } from "@/api/users.api";
import { AuthDto } from "@/types/dto/auth.dto";
import { CreateUserDto, UserDto } from "@/types/dto/user.dto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function registerUser(user: CreateUserDto) {
  try {
    const data: UserDto = await usersApi.createUser(user);
    console.log(data);
    redirect("/user/login");
  } catch (error) {
    redirect("/error");
  }
}

export async function loginUser(email: string, password: string) {
  try {
    console.log(email, password);
    const data: AuthDto = await authApi.logIn(email, password);
    console.log(data);
    redirect("/");
  } catch (error) {
    redirect("/error");
  }
}

export async function getAuthCookie() {
  const cookieStore = cookies();
  const auth = (await cookieStore).get("auth");
  return auth;
}
