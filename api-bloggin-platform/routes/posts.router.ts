import { Hono } from "hono";
import { PostsService } from "../services/posts.service";
import { Bindings, Variables } from "index";
import { z } from "zod";
import { CreatePostDTO } from "types/dto";
import { Post } from "@prisma/client";
import authMiddleware from "middleware";

const PostsRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Validation schemas
const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  Content: z.string().min(1, "Content is required"),
  category: z.string(),
  tags: z.array(z.string()).default([]),
});

const updatePostSchema = createPostSchema.partial();

const idParamSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
});

PostsRouter.post("/posts", authMiddleware, async (c) => {
  const postsService = new PostsService(c.env.DB);
  const body: CreatePostDTO = await c.req.json();
  const user = c.get("user");

  try {
    const validatedData = createPostSchema.parse(body);
    const post: Post = await postsService.createPost(user.id, validatedData);
    return c.json(post, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Invalid input", details: error.errors }, 400);
    }
    console.error(error);
    return c.json({ error: "Failed to create post" }, 500);
  }
});

PostsRouter.get("/posts", async (c) => {
  const postsService = new PostsService(c.env.DB);

  try {
    const posts: Post[] = await postsService.getAllPosts();
    if (posts.length === 0) {
      return c.json({ message: "There are no Posts to show" }, 200);
    }
    return c.json(posts, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to fetch posts" }, 500);
  }
});

PostsRouter.get("/posts/:id", async (c) => {
  const postsService = new PostsService(c.env.DB);

  try {
    const { id } = idParamSchema.parse({ id: c.req.param("id") });
    const post: Post | null = await postsService.getPostById(id);

    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }

    return c.json(post, 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Invalid ID format" }, 400);
    }
    console.error(error);
    return c.json({ error: "Failed to fetch post" }, 500);
  }
});

PostsRouter.put("/posts/:id", authMiddleware, async (c) => {
  const postsService = new PostsService(c.env.DB);
  const user = c.get("user");

  try {
    const { id } = idParamSchema.parse({ id: c.req.param("id") });
    const body = await c.req.json();
    const validatedData = updatePostSchema.parse(body);
    const existingPost: Post | null = await postsService.getPostById(id);
    if (!existingPost) {
      return c.json({ error: "Post not found" }, 404);
    }

    if (existingPost.authorId !== user.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const updatedPost: Post = await postsService.updatePost(
      id,
      user.id,
      validatedData
    );
    return c.json(updatedPost, 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Invalid input", details: error.errors }, 400);
    }
    console.error(error);
    return c.json({ error: "Failed to update post" }, 500);
  }
});

PostsRouter.delete("/posts/:id", authMiddleware, async (c) => {
  const postsService = new PostsService(c.env.DB);
  const user = c.get("user");
  try {
    const { id } = idParamSchema.parse({ id: c.req.param("id") });

    const existingPost: Post | null = await postsService.getPostById(id);
    if (!existingPost) {
      return c.json({ error: "Post not found" }, 404);
    }

    if (existingPost.authorId !== user.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await postsService.deletePost(id);
    return c.json({ status: 204 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Invalid ID format" }, 400);
    }
    console.error(error);
    return c.json({ error: "Failed to delete post" }, 500);
  }
});

export default PostsRouter;
