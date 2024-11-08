import { PrismaD1 } from '@prisma/adapter-d1';
import { Post, PrismaClient } from '@prisma/client';
import { CreateNoteDTO } from '../../types/dto';

export class NotesService {
	private prisma: PrismaClient;
	private db: D1Database;

	constructor(db: D1Database) {
		this.db = db;
		const adapter = new PrismaD1(db);
		this.prisma = new PrismaClient({ adapter }) as unknown as PrismaClient;
	}

	async getAllNotes(): Promise<Post[]> {
		return this.prisma.post.findMany();
	}

	async getNoteById(id: string): Promise<Post | null> {
		return this.prisma.post.findUnique({ where: { id } });
	}

	async createNote(data: CreateNoteDTO): Promise<Post> {
		return this.prisma.post.create({
			data: {
				id: data.noteId,
				title: data.title,
				content: data.content,
				userId: Number(data.userId),
			},
		});
	}

	async updateNote(id: string, noteData: Partial<CreateNoteDTO>): Promise<Post> {
		return this.prisma.post.update({
			where: { id },
			data: {
				...{
					...(noteData.title && { title: noteData.title }),
					...(noteData.content && { content: noteData.content }),
				},
			},
		});
	}

	async deleteNote(id: string) {
		await this.prisma.post.delete({ where: { id } });
	}
}
