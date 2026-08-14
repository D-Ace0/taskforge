export type ApiResponseError = {
    message: string | string[];
    error: string;
    statusCode: number
}

export type User = {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string
}

export type RegisterResponse = User;


export type LoginResponse = {
  accessToken: string;
  user: User;
};