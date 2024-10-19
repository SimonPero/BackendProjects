export interface CreatePostDTO {
    title: string;
    content: string;
    category: string;
    authorId: number;
    tagIds: number[];
  }