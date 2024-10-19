import { Hono } from "hono";
import { PostsService } from '../services/posts.service';
import { Bindings } from "index";
import { z } from "zod";


const PostsRouter = new Hono<{ Bindings: Bindings }>();

// Validation schemas
const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string(),
  authorId: z.number(),
  tagIds: z.array(z.number()).default([])
});

const updatePostSchema = createPostSchema.partial();

const idParamSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10))
});

// Create post
PostsRouter.post("/posts", async (c) => {
  const postsService = new PostsService(c.env.DB);
  const body = await c.req.json();

  try {
    const validatedData = createPostSchema.parse(body);
    const post = await postsService.createPost(validatedData);
    return c.json(post, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Invalid input", details: error.errors }, 400);
    }
    console.error(error);
    return c.json({ error: "Failed to create post" }, 500);
  }
});

// Get all posts
PostsRouter.get("/posts", async (c) => {
  const postsService = new PostsService(c.env.DB);

  try {
    const posts = await postsService.getAllPosts();
    return c.json(posts);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to fetch posts" }, 500);
  }
});

PostsRouter.get("/posts/:id", async (c) => {
  const postsService = new PostsService(c.env.DB);

  try {
    const { id } = idParamSchema.parse({ id: c.req.param('id') });
    const post = await postsService.getPostById(id);
    
    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }

    return c.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Invalid ID format" }, 400);
    }
    console.error(error);
    return c.json({ error: "Failed to fetch post" }, 500);
  }
});

PostsRouter.patch("/posts/:id", async (c) => {
  const postsService = new PostsService(c.env.DB);
  
  try {
    const { id } = idParamSchema.parse({ id: c.req.param('id') });
    const body = await c.req.json();
    const validatedData = updatePostSchema.parse(body);

    const existingPost = await postsService.getPostById(id);
    if (!existingPost) {
      return c.json({ error: "Post not found" }, 404);
    }

    const updatedPost = await postsService.updatePost(id, validatedData);
    return c.json(updatedPost);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Invalid input", details: error.errors }, 400);
    }
    console.error(error);
    return c.json({ error: "Failed to update post" }, 500);
  }
});

PostsRouter.delete("/posts/:id", async (c) => {
  const postsService = new PostsService(c.env.DB);

  try {
    const { id } = idParamSchema.parse({ id: c.req.param('id') });
    
    const existingPost = await postsService.getPostById(id);
    if (!existingPost) {
      return c.json({ error: "Post not found" }, 404);
    }

    await postsService.deletePost(id);
    return c.json({ message: "Post deleted successfully" }, 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Invalid ID format" }, 400);
    }
    console.error(error);
    return c.json({ error: "Failed to delete post" }, 500);
  }
});

export default PostsRouter;