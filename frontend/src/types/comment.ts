import type { User } from "@/types/auth";

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: Pick<User, "id" | "name" | "email">;
};

export type CommentListResponse = {
  comments: Comment[];
  pagination: {
    page: number;
    limit: number;
    totalComments: number;
    totalPages: number;
  };
};
