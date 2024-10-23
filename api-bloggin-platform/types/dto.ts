export interface CreatePostDTO {
  title: string;
  Content: string;
  category: string;
  tags: string[];
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}
