import { PrismaD1 } from "@prisma/adapter-d1";
import type { CreatePostDTO } from "../types/dto";
import { Post, PrismaClient } from "@prisma/client";

export class PostsService {
  private prisma: PrismaClient;
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
    const adapter = new PrismaD1(db);
    this.prisma = new PrismaClient({ adapter }) as unknown as PrismaClient;
  }

  private async getOrCreateTags(tagNames: string[]) {
    const tags = [];

    for (const name of tagNames) {
      const normalizedName = name.toLowerCase();

      try {
        const existingTag = await this.prisma.tags.findUnique({
          where: { name: normalizedName },
        });

        if (existingTag) {
          tags.push(existingTag);
          continue;
        }

        const newTag = await this.prisma.tags.create({
          data: { name: normalizedName },
        });

        tags.push(newTag);
      } catch (error) {
        console.error(`Failed to process tag: ${name}`, error);
      }
    }

    return tags;
  }

  async getPostById(id: number): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            posts: { select: { id: true } },
            password: false,
          },
        },
        tags: true,
      },
    });
  }

  async createPost(userId: number, data: CreatePostDTO): Promise<Post> {
    try {
      const { tags: tagNames = [], ...postData } = data;
      const tags =
        tagNames.length > 0 ? await this.getOrCreateTags(tagNames) : [];

      if (tagNames.length > 0 && tags.length === 0) {
        throw new Error("Failed to process tags");
      }

      return this.prisma.post.create({
        data: {
          title: postData.title,
          Content: postData.Content,
          category: postData.category,
          author: {
            connect: { id: userId },
          },
          ...(tags.length > 0 && {
            tags: {
              connect: tags.map((tag) => ({ id: tag.id })),
            },
          }),
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              posts: { select: { id: true } },
              password: false,
            },
          },
          tags: true,
        },
      });
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  }

  async getAllPosts(): Promise<Post[]> {
    return await this.prisma.post.findMany({
      include: {
        author: true,
        tags: true,
      },
    });
  }
  async updatePost(
    id: number,
    userId: number,
    data: Partial<CreatePostDTO>
  ): Promise<Post> {
    try {
      const existingPost = await this.prisma.post.findUnique({
        where: { id },
      });

      if (!existingPost) {
        throw new Error(`Post with id ${id} not found`);
      }

      const { tags: tagNames, ...postData } = data;
      let tagsConnect;

      if (Array.isArray(tagNames)) {
        const tags =
          tagNames.length > 0 ? await this.getOrCreateTags(tagNames) : [];

        tagsConnect = {
          set: [],
          ...(tags.length > 0 && {
            connect: tags.map((tag) => ({ id: tag.id })),
          }),
        };
      }

      return this.prisma.post.update({
        where: { id },
        data: {
          ...(postData.title && { title: postData.title }),
          ...(postData.Content && { Content: postData.Content }),
          ...(postData.category && { category: postData.category }),
          ...(userId && {
            author: {
              connect: { id: userId },
            },
          }),
          ...(tagsConnect && { tags: tagsConnect }),
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              password: false,
            },
          },
          tags: true,
        },
      });
    } catch (error) {
      console.error(`Error updating post ${id}:`, error);
      throw error;
    }
  }

  async deletePost(id: number) {
    return this.prisma.post.delete({
      where: { id },
    });
  }
}
