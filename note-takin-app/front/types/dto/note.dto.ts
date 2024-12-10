export type NoteDto = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  content: string;
  userId: number;
};

export type CreateNoteDto = {
  title: string;
  content: string;
  userId: number;
};

export interface SpellCheckResult {
  original: string;
  suggestions: string[];
}

export interface putNoteData {
  title?: string | undefined;
  content?: string | undefined;
}
