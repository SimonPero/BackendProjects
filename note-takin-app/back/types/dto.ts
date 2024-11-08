export interface CreateNoteDTO {
  noteId:string;
  title: string;
  content:string;
  userId: number;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}
