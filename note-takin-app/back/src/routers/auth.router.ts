import { Hono } from 'hono';
import { setSignedCookie, deleteCookie, getSignedCookie, getCookie } from 'hono/cookie';
import { Bindings, Variables } from '..';
import authMiddleware from '../middlewares/authMiddleware';
import AuthService from '../services/auth.service';
import { UserService } from '../services/users.service';

const AuthRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();
const SECRET = 'xm2lGWxpRhQipatfYLFj9qsVWVxDK8cppJpiafUq3SuLTZC4SuTm8Ap8lLYg2ylr';
AuthRouter.post('/login', async (c) => {
	try {
		const { email, password } = await c.req.json();

		if (!email || !password) {
			return c.json({ error: 'Email and password are required' }, 400);
		}

		const authService = new AuthService();
		const userService = new UserService(c.env.DB);

		const userFound = await userService.getUserByEmail(email);

		if (!userFound) {
			return c.json({ error: 'User not found' }, 404);
		}

		const userVerified = await authService.verifyUser(password, userFound.password);

		if (!userVerified) {
			return c.json({ error: 'Invalid credentials' }, 401);
		}

		await setSignedCookie(c, 'auth', userFound.id.toString(), SECRET, {
			httpOnly: true,
			secure: true,
			path: '/',
			maxAge: 60 * 60 * 24,
			sameSite: 'None',
		});

		const cookieHeader = getCookie(c, 'auth');

		return c.json({
			success: true,
			user: {
				id: userFound.id,
				email: userFound.email,
			},
			debug: {
				cookieHeader,
			},
		});
	} catch (error) {
		console.error('Login error:', error);
		return c.json({ error: 'An error occurred during login' }, 500);
	}
});
AuthRouter.get('/debug-cookie', async (c) => {
	const cookieHeader = c.req.header('Cookie');
	const rawAuthCookie = getCookie(c, 'auth');
	let verifiedUserId = null;

	try {
		verifiedUserId = await getSignedCookie(c, SECRET, 'auth');
	} catch (error) {
		console.error('Cookie verification failed:', error);
	}

	return c.json({
		cookieHeader,
		rawAuthCookie,
		verifiedUserId,
		isValid: !!verifiedUserId,
	});
});

AuthRouter.get('/protected', authMiddleware, (c) => {
	const user = c.get('user');
	return c.json({ message: `Hello ${user.name}!` });
});

AuthRouter.get('/logout', (c) => {
	deleteCookie(c, 'auth');
	return c.json({ success: true });
});

export default AuthRouter;
