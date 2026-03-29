import { UserRole } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }

    interface Locals {
      user?: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
        iat?: number;
        exp?: number;
      };
    }
  }
}

export {};
