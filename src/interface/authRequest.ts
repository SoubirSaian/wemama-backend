// src/app/interfaces/authRequest.ts
import { Request } from 'express';

export interface AuthRequest extends Request {
  user: {
    userId: string;
    email: string;
    name: string;
  };
}
