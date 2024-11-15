"use server";

import { authApi } from "@/api/auth.api";
import { usersApi } from "@/api/users.api";
import { AuthDto } from "@/types/dto/auth.dto";
import { CreateUserDto, UserDto } from "@/types/dto/user.dto";
import { cookies } from "next/headers";

export async function registerUser(user: CreateUserDto) {
  try {
    const data: UserDto = await usersApi.createUser(user);
    return data;
  } catch (error) {
    return error;
  }
}

export async function loginUser(email: string, password: string) {
  const data: AuthDto = await authApi.logIn(email, password);
  return data;
}

export async function logOutUser() {
  const data = await authApi.logOut();
  return data;
}

export async function getAuthCookie() {
  const cookieStore = cookies();
  const auth = (await cookieStore).get("auth");
  return auth;
}
