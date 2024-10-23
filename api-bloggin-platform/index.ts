import { Hono } from "hono";
import { User } from "@prisma/client";
import PostsRouter from "./routes/posts.router";
import UserRouter from "routes/users.router";
import AuthRouter from "routes/auth.router";
export interface Bindings {
  DB: D1Database;
}
export type Variables = {
  user: Omit<User, 'password'>;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>().basePath(
  "/api"
);

app.route("/users", UserRouter);
app.route("/auth", AuthRouter)
app.route("/articles", PostsRouter);

export default app;
