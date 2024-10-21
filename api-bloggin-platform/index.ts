import { Hono } from "hono";
import PostsRouter from "./routes/posts.router";

export interface Bindings {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");
app.route("/articles", PostsRouter);

export default app;
