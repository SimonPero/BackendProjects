export interface Post {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  Content: string;
  author: User;
  category: string;
  authorId: number;
  tags: TagWithoutPosts[];
}

export interface User {
  id: number;
  email: string;
  name: string;
  posts: Post[];
}

export interface TagWithoutPosts {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
  posts: Post[];
}
