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

    console.log("userOnboardUser:", user);

    const { resumeUrl, name, email, authUserId } = req.body;
    console.log("req.body:", req.body);

    // check whether user exsists
    const existingUser = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", authUserId)
      .single();

    console.log("existingUser:", existingUser);

    if (!existingUser) {
      // 2. Create or update profile row in Supabase
      const profile = await authService.createOrUpdateProfile({
        auth_user_id: authUserId,
        name: name ?? user.name,
        email: email ?? user.email,
        resume_url: resumeUrl,
      });
      console.log("profile:", profile);
    }

    // 3. Call n8n webhook to trigger resume parsing
    console.log("n8n Workflow started");
    console.log("process.env.N8N_WEBHOOK_URL:", process.env.N8N_WEBHOOK_URL);
    try {
      const response = await axios.post(
        `${process.env.N8N_WEBHOOK_URL}/webhook/4b06475c-cd8a-4cba-9f7d-9f6d8f696e55`,
        {
          auth_user_id: authUserId,
          name: name ?? user.name,
          email: email ?? user.email,
          resume_url: resumeUrl,
        },
      );
      console.log("n8n response:", response.data);
      // 4. Return success
    } catch (n8nError: any) {
      // Don't fail the whole request if n8n fails
      // Profile is already created — n8n can be retried
      console.error("n8n webhook failed:");
      console.error("message:", n8nError.message);
      console.error("code:", n8nError.code);
    }

    res.status(201).json({
      success: true,
      message: "Resume Parsedsuccessfully",
      // profile: {
      //   id: profile.id,
      //   name: profile.name,
      //   email: profile.email,
      //   resume_url: profile.resume_url,
      // },
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
