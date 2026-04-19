import { supabase } from "../config/supabase.js";
import { AppError } from "../middleware/errorHandler.js";
import type { AuthUser, IProfile } from "../types/auth.types.js";

export const authService = {
  async createOrUpdateProfile({
    auth_user_id,
    name,
    email,
    resume_url,
  }: Partial<
    Pick<IProfile, "auth_user_id" | "name" | "email" | "resume_url">
  >): Promise<IProfile> {
    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          auth_user_id,
          name,
          email,
          resume_url,
        },
        {
          onConflict: "auth_user_id",
        },
      )
      .select()
      .single();

    if (error || !data) {
      throw new AppError(500, `Profile upsert failed: ${error?.message}`);
    }

    return data as IProfile;
  },

  // Get full profile for authenticated user
  async getProfile(authUserId: string): Promise<AuthUser> {
    // console.log("authUserId:", authUserId);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", authUserId)
      .single();

    if (error || !data) {
      throw new AppError(404, "Profile not found");
    }

    return data as IProfile;
  },

  // Update profile
  async updateProfile(
    userId: string,
    input: Partial<Pick<IProfile, "name" | "resume_url">>,
  ): Promise<IProfile> {
    const { data, error } = await supabase
      .from("profiles")
      .update(input)
      .eq("id", userId)
      .select()
      .single();

    if (error || !data) {
      throw new AppError(500, `Failed to update profile: ${error?.message}`);
    }

    return data as IProfile;
  },
};
