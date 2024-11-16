export type NoteDto = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  content: string;
};

export type CreateNoteDto = {
  title: string;
  content: string;
  userId: number;
};
