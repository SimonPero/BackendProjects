import { Hono } from 'hono';
import { Variables, Bindings } from '..';
import { Post } from '@prisma/client';
import { CreateNoteDTO } from '../../types/dto';
import { z } from 'zod';
import authMiddleware from '../middlewares/authMiddleware';
import { NotesService } from '../services/notes.service';

const NoteRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

const createNoteSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	content: z.string().min(1, 'File content is required'),
	userId: z.number().min(1, 'userId is required'),
});

const updateNoteSchema = createNoteSchema.partial();

NoteRouter.post('/', async (c) => {
	const body: CreateNoteDTO = await c.req.json();
	const noteService = new NotesService(c.env.DB);

	try {
		const validatedData = createNoteSchema.parse(body);
		const noteData = {
			...validatedData,
			noteId: crypto.randomUUID(),
		};
		const notes = await noteService.createNote(noteData);

		return c.json(notes, 200);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return c.json({ error: 'Invalid request data' }, 400);
		}
		console.error(error);
		return c.json({ error: 'Failed to create note' }, 500);
	}
});
NoteRouter.get('/', async (c) => {
	const noteService = new NotesService(c.env.DB);

	try {
		const notes = await noteService.getAllNotes();
		return c.json(notes, 200);
	} catch (error) {
		console.error(error);
		return c.json({ error: 'Failed to fetch notes' }, 500);
	}
});

NoteRouter.get('/user/:userId', async (c) => {
	const userId: number = parseInt(c.req.param('userId'));
	const noteService = new NotesService(c.env.DB);

	try {
		const notes = await noteService.getAllNotesOfUser(userId);
		return c.json(notes, 200);
	} catch (error) {
		console.error(error);
		return c.json({ error: 'Failed to fetch notes' }, 500);
	}
});
NoteRouter.get('/:id', async (c) => {
	const id: string = c.req.param('id');
	const noteService = new NotesService(c.env.DB);

	try {
		const note = await noteService.getNoteById(id);
		if (!note) {
			throw new Error(`Failed to found the note with id ${id}`);
		}
		return c.json(note, 200);
	} catch (error) {
		console.error(error);
		return c.json({ error: `Failed to found the note` }, 500);
	}
});
NoteRouter.delete('/:id', authMiddleware, async (c) => {
	const id: string = c.req.param('id');
	const noteService = new NotesService(c.env.DB);
	const user = c.get('user');

	try {
		const foundNote: Post | null = await noteService.getNoteById(id);
		if (!foundNote) {
			return c.json({ error: 'Note not found' }, 404);
		}

		if (foundNote.userId !== user.id) {
			return c.json({ error: 'Unauthorized' }, 401);
		}
		await noteService.deleteNote(id);
		return c.text('', 204);
	} catch (error) {
		console.error(error);
		return c.json({ error: 'Failed to delete the note' }, 500);
	}
});

NoteRouter.put('/:id', authMiddleware, async (c) => {
	const id: string = c.req.param('id');
	const noteService = new NotesService(c.env.DB);
	const user = c.get('user');

	try {
		const foundNote: Post | null = await noteService.getNoteById(id);
		if (!foundNote) {
			return c.json({ error: 'Note not found' }, 404);
		}

		if (foundNote.userId !== user.id) {
			return c.json({ error: 'Unauthorized' }, 401);
		}
		const body = await c.req.json();
		const validatedData = updateNoteSchema.parse(body);
		const updatedNote = await noteService.updateNote(id, validatedData);
		return c.json(updatedNote, 200);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return c.json({ error: 'Invalid inputs', details: error.errors }, 400);
		}
		console.error(error);
		return c.json({ error: 'Failed to update Note' }, 500);
	}
});

NoteRouter.get('/check/:id', async (c) => {
	return c.json({ dou: 'dou' });
});

export default NoteRouter;
