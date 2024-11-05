import { Hono } from 'hono';
import { User } from '@prisma/client';
import UserRouter from './routers/user.router';

export interface Bindings {
	DB: D1Database;
}
export type Variables = {
	user: Omit<User, 'password'>;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>().basePath('/api');

app.route("/users", UserRouter);
