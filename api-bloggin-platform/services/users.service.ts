import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient, User } from "@prisma/client";
import { CreateUserDto } from "types/dto";

export class UserService {
  private prisma: PrismaClient;
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
    const adapter = new PrismaD1(db);
    this.prisma = new PrismaClient({ adapter }) as unknown as PrismaClient;
  }

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany({ include: { posts: true } });
  }

  async getUserById(id: number): Promise<Omit<User, "password"> | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        posts: { select: { id: true } },
        password: false,
      },
    });
  }

  async getUserByEmail(
    email: string
  ): Promise<{ id: number; email: string; password: string } | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true },
    });
  }

  async createUser(data: CreateUserDto): Promise<User> {

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
  }
  
  async updateUser(
    id: number,
    userData: Partial<CreateUserDto>
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...{
          ...(userData.name && { name: userData.name }),
        },
      },
      include: { posts: { select: { id: true } } },
    });
  }
}
