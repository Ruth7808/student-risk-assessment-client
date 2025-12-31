import type { AuthUser } from "./authSlice";

export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = {
  fullName: string;
  username: string;
  password: string;
  role: "admin" | "principal" | "teacher";
  schoolId: string;
  className?: string;
  email?: string;
  phone?: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};
