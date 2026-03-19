// src/app/interfaces/authRequest.ts
import { Request } from 'express';

export interface AuthRequest extends Request {
  user: {
    authId: string;
    email: string;
    profileId: string;
  },
  admin: {
    authId: string;
    email: string;
    profileId: string;
  },
}

export interface AdminAuthRequest extends Request {
  admin: {
    authId: string;
    email: string;
    profileId: string;
  },
}
