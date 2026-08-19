import { apiRequest } from "@/lib/api/client";
import type { User } from "@/types/auth";

export type UpdateProfileInput = {
  name?: string;
  email?: string;
};

export function updateProfile(token: string, input: UpdateProfileInput) {
  return apiRequest<User>("/users/me", token, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
