import { Request } from 'express';

export type RefreshRequest = Request & {
  cookies: {
    refreshToken?: string;
  };
};
