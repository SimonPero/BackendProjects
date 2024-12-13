import { Hono } from 'hono';
import { User } from '@prisma/client';
import UserRouter from './routers/user.router';
import NoteRouter from './routers/note.router';
import AuthRouter from './routers/auth.router';
import { cors } from 'hono/cors';

interface Env {
	DB: D1Database;
	API_URL: string;
	FRONTEND_URL: string;
}

export interface Bindings {
	DB: D1Database;
}

export type Variables = {
	user: Omit<User, 'password'>;
};

const app = new Hono<{
	Bindings: Bindings & Env;
	Variables: Variables;
}>().basePath('/api');

app.use('/*', async (c, next) => {
	const apiUrl = c.env.API_URL;

	const allowedOrigins = [
		'http://localhost:3000',
		'http://127.0.0.1:3000',
		'https://backend-projects-ra0xiajb5-simonperos-projects.vercel.app',
	];

	// Add production URL if it exists
	if (apiUrl) {
		allowedOrigins.push(apiUrl);
	}

	// Create CORS middleware with dynamic origin
	const corsMiddleware = cors({
		origin: (origin) => {
			if (!origin || origin === 'null') {
				return allowedOrigins[0];
			}
			return allowedOrigins.includes(origin) ? origin : allowedOrigins[3];
		},
		credentials: true,
		allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PUT'],
		allowHeaders: ['Content-Type', 'Authorization'],
		exposeHeaders: ['Set-Cookie'],
		maxAge: 86400,
	});

	return corsMiddleware(c, next);
});

app.route('/users', UserRouter);
app.route('/notes', NoteRouter);
app.route('/auth', AuthRouter);

export default app;
