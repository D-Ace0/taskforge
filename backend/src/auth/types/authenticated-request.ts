import type { Request } from 'express';
import type { AccessTokenPayload } from './access-token-payload';

export type AuthenticatedRequest = Request & {
  user: AccessTokenPayload;
};
