import { CreateUserDto, UserDto } from "@/types/dto/user.dto";

class UsersApi {
  async getAllUsers(): Promise<UserDto[]> {
    const res = await fetch(`${process.env.API_URL}/users`);
    const data = await res.json();
    return data;
  }
  async getUserById(id: string): Promise<UserDto> {
    const res = await fetch(`${process.env.API_URL}/users/${id}`);
    const data = await res.json();
    return data;
  }

  async createUser(user: CreateUserDto): Promise<UserDto> {
    const res = await fetch(`${process.env.API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const data = await res.json();
    return data;
  }
}

export const usersApi = new UsersApi();
