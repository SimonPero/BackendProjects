import { UserService } from '../services/users.service';
import { Context, Next } from 'hono';
import { getSignedCookie } from 'hono/cookie';

const SECRET = 'xm2lGWxpRhQipatfYLFj9qsVWVxDK8cppJpiafUq3SuLTZC4SuTm8Ap8lLYg2ylr';

export default async function authMiddleware(c: Context, next: Next) {
	try {
		const userId = await getSignedCookie(c, SECRET, 'auth');

		if (!userId) {
			return c.json({ error: 'Unauthorized' }, 401);
		}

		const userService = new UserService(c.env.DB);
		const user = await userService.getUserById(parseInt(userId));

		if (!user) {
			return c.json({ error: 'User not found' }, 401);
		}

		c.set('user', user);
		await next();
	} catch (error) {
		console.error('Auth middleware error:', error);
		return c.json({ error: 'Authentication failed' }, 401);
	}
}
