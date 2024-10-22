import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";

export default class AuthService {
  private prisma: PrismaClient;
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
    const adapter = new PrismaD1(db);
    this.prisma = new PrismaClient({ adapter }) as unknown as PrismaClient;
  }

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)));
  }

  async verifyUser(password: string, hashedPassword: string): Promise<boolean> {
    const hashedInput = await this.hashPassword(password);
    return hashedInput === hashedPassword;
  }
}