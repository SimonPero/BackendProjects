import { User } from '@prisma/client';
import { Hono } from 'hono';
import { Bindings, Variables } from '../index';
import authMiddleware from '../middlewares/authMiddleware';
import { UserService } from '../services/users.service';
import AuthService from '../services/auth.service';
import { CreateUserDto } from '../../types/dto';
import { z } from 'zod';
const UserRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

const idParamSchema = z.object({
	id: z.string().transform((val) => parseInt(val, 10)),
});

const createUserSchema = z.object({
	name: z.string().min(1, 'Title is required'),
	email: z.string().min(1, 'Content is required'),
	password: z.string(),
});

const updateUserSchema = createUserSchema.partial();

UserRouter.get('/:id', async (c) => {
	const userService = new UserService(c.env.DB);
	try {
		const { id } = idParamSchema.parse({ id: c.req.param('id') });

		const user: Omit<User, 'password'> | null = await userService.getUserById(id);
		if (!user) {
			return c.json({ error: 'User not found' }, 404);
		}
		return c.json(user, 200);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return c.json({ error: 'Invalid ID format' }, 400);
		}
		console.error(error);
		return c.json({ error: 'Failed to fetch user' }, 500);
	}
});

UserRouter.get('/', async (c) => {
	const userService = new UserService(c.env.DB);
	try {
		const users: User[] = await userService.getAllUsers();
		if (users.length === 0) {
			return c.json({ message: 'There are no Users to show' }, 200);
		}
		return c.json(users, 200);
	} catch (error) {
		console.error();
		return c.json({ error: 'Failed to fetch users' }, 500);
	}
});

UserRouter.post('/', async (c) => {
	const userService = new UserService(c.env.DB);
	const authService = new AuthService();

	const body: CreateUserDto = await c.req.json();
	try {
		const validatedData = createUserSchema.parse(body);
		validatedData.password = await authService.hashPassword(validatedData.password);
		const user: User = await userService.createUser(validatedData);
		return c.json(user, 201);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return c.json({ error: 'Invalid inputs', details: error.errors }, 400);
		}
		console.error(error);
		return c.json({ error: 'Failed to create user' }, 500);
	}
});

UserRouter.put('/:id', authMiddleware, async (c) => {
	const userService = new UserService(c.env.DB);
	const user = c.get('user');

	try {
		const { id } = idParamSchema.parse({ id: c.req.param('id') });
		const body = await c.req.json();
		const validatedData = updateUserSchema.parse(body);

		const foundUser: Omit<User, 'password'> | null = await userService.getUserById(id);
		if (!foundUser) {
			return c.json({ error: 'User not found' }, 404);
		}

		if (foundUser.id !== user.id) {
			return c.json({ error: 'Unauthorized' }, 401);
		}

		const updatedUser: User = await userService.updateUser(id, validatedData);
		return c.json(updatedUser, 200);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return c.json({ error: 'Invalid inputs', details: error.errors }, 400);
		}
		console.error(error);
		return c.json({ error: 'Failed to update user' }, 500);
	}
});

export default UserRouter;
