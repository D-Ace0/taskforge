export type User = {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string
}

export type LoginResponse = {
    accessToken: string;
    user: User;
}

export type RegisterResponse = {
    user: User;
}

export type ApiResponseError = {
    message: string | string[];
    error: string;
    statusCode: number
}

export type RefreshResponse = {
    accessToken: string;
}