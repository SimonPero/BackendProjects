export interface Post {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: string;
  author: User;
  authorId: number;
  category: string;
  tags: Tag[];
}

export interface User {
  id: number;
  email: string;
  name: string;
  posts: Post[];
}

export interface Tag {
  id: number;
  name: string;
  posts: Post[];
}
