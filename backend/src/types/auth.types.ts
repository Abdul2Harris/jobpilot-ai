import type { Request } from "express";

export interface AuthUser {
  id: string;
  name: string | null;
  email: string;
}
export interface IProfile {
  id: string;
  auth_user_id: string;
  email: string;
  name: string | null;
  resume_url: string | null;
  phone: string | null;
}
