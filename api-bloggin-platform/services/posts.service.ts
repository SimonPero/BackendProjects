import { PrismaD1 } from "@prisma/adapter-d1";
import type { CreatePostDTO } from "../types/dto";
import { PrismaClient } from "@prisma/client";

export class PostsService {
  private prisma: PrismaClient;
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
    const adapter = new PrismaD1(db);
    this.prisma = new PrismaClient({ adapter }) as unknown as PrismaClient;
  }

  async getPostById(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        tags: true,
      },
    });
  }

  async createPost(data: CreatePostDTO) {
    return this.prisma.post.create({
      data: {
        title: data.title,
        Content: data.content,
        category: data.category,
        author: {
          connect: { id: data.authorId },
        },
        tags: {
          connect: data.tagIds.map((id) => ({ id })),
        },
      },
      include: {
        author: true,
        tags: true,
      },
    });
  }

  async getAllPosts() {
    return await this.prisma.post.findMany({
      include: {
        author: true,
        tags: true,
      },
    });
  }
  async updatePost(id: number, data: Partial<CreatePostDTO>) {
    return this.prisma.post.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.content && { content: data.content }),
        ...(data.category && { category: data.category }),
        ...(data.authorId && {
          author: {
            connect: { id: data.authorId },
          },
        }),
        ...(data.tagIds && {
          tags: {
            set: [], // Clear existing tags
            connect: data.tagIds.map((id) => ({ id })),
          },
        }),
      },
      include: {
        author: true,
        tags: true,
      },
    });
  }

  async deletePost(id: number) {
    return this.prisma.post.delete({
      where: { id },
    });
  }
}
