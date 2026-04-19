import type { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase.js";
import { AppError } from "./errorHandler.js";
import { catchAsync } from "./catchAsync.js";

export const authenticate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // console.log('req:',req.headers)
    // 1. Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError(401, "Missing or invalid authorization header"));
    }

    const token = authHeader.split(" ")[1];
    // console.log("token:", token);

    if (!token) {
      return next(new AppError(401, "Missing token"));
    }

    // 2. Verify JWT with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    // console.log("user:", user);

    if (error || !user) {
      // console.log("error:", error);
      return next(new AppError(401, "Invalid or expired token"));
    }

    // 3. Fetch profile from Supabase authentication
    // const {
    //   data: { user },
    //   error: userError,
    // } = await supabase
    //   .from("profiles")
    //   .select("id, auth_user_id, name, email, phone, resume_url")
    //   .eq("id", user.id)
    //   .single();

    // console.log("profile:",profile);

    // if (profileError || !profile) {
    //   return next(new AppError(404, "Profile not found"));
    // }

    // 4. Attach to res.locals so controllers can use it
    res.locals["user"] = {
      id: user.id,
      // auth_user_id: profile.auth_user_id,
      name: user.user_metadata.name,
      email: user.email,
    };

    next();
  },
);
