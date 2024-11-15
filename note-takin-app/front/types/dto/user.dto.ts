import { NoteDto } from "./note.dto";

export type UserDto = {
  id: number;
  email: string;
  name: string;
  password: string;
  posts: NoteDto[];
};

export type CreateUserDto = {
  email: string;
  name: string;
  password: string;
};

