import type { Request, Response } from "express";
import { catchAsync } from "../middleware/catchAsync.js";
import { authService } from "../services/authService.js";
import type { AuthUser } from "../types/auth.types.js";
import axios from "axios";
import { supabase } from "../config/supabase.js";

export const authController = {
  // POST /api/v1/auth/onboard
  onboardUser: catchAsync(async (req: Request, res: Response) => {
    const user = res.locals["user"] as AuthUser;

    // console.log("userOnboardUser:", user);

    const { resumeUrl, name, email, authUserId } = req.body;
    console.log("req.body:", req.body);

    // check whether user exsists
    const existingUser = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", authUserId)
      .single();

    console.log("existingUser:", existingUser);

    if (!existingUser.data) {
      // 2. Create or update profile row in Supabase
      const profile = await authService.createOrUpdateProfile({
        auth_user_id: authUserId,
        name: name ?? user.name,
        email: email ?? user.email,
        resume_url: resumeUrl,
      });
      console.log("profile:", profile);
    }

    // 3. Call n8n webhook and wait for resume parsing to complete
    console.log("n8n Workflow started on", process.env.N8N_RESUME_PARSER_URL);
    let n8nResponse;
    try {
      n8nResponse = await axios.post(
        `${process.env.N8N_RESUME_PARSER_URL}`,
        {
          auth_user_id: authUserId,
          name: name ?? user.name,
          email: email ?? user.email,
          resume_url: resumeUrl,
        },
      );
      console.log("n8n response:", n8nResponse.data);
    } catch (n8nError: any) {
      console.error("n8n webhook failed:", n8nError.message);
      res.status(502).json({
        success: false,
        message: "Resume parsing failed. Please try again.",
        error: n8nError.response?.data ?? n8nError.message,
      });
      return;
    }

    // 4. Return success only after n8n confirms
    res.status(201).json({
      success: true,
      message: "Resume parsed successfully",
      data: n8nResponse.data,
    });
  }),

  // GET /api/v1/auth/profile
  getProfile: catchAsync(async (_req: Request, res: Response) => {
    const user = res.locals["user"] as AuthUser;
    // console.log("usergetProfile:", user);

    const profile = await authService.getProfile(user.id);

    // res.status(200).json({
    //   status: "success",
    //   data: profile,
    // });

    res.status(200).json(profile);
  }),

  // PATCH /api/v1/auth/profile
  updateProfile: catchAsync(async (req: Request, res: Response) => {
    const user = res.locals["user"] as AuthUser;
    const input = req.body;

    const profile = await authService.updateProfile(user.id, input);

    res.status(200).json({
      status: "success",
      data: profile,
    });
  }),
};
