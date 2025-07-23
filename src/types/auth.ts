export type UserRole = "STUDENT" | "LECTURER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  emailVerified?: Date;
  image?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  emailVerified?: boolean;
  image?: string;
}

export interface Session {
  user: AuthUser;
  expires: string;
}
