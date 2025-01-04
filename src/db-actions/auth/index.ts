import { db, DbQueryResult } from "@/types";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/types/schema";
import { createServerActionProcedure } from "zsa";
import { z } from "zod";

export const currentAuthUserProc = createServerActionProcedure()
  .input(z.object({ db: z.custom<db>() }))
  .handler(async ({ input: { db } }) => {
    try {
      const { data, error } = await db.auth.getUser();
      if (error) {
        throw new Error(error.message);
      }

      return data.user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  });

export async function loginWithPassword(
  db: db,
  email: string,
  password: string
): Promise<DbQueryResult> {
  const { error } = await db.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Login successful", data: undefined };
}

export async function logout(db: db): Promise<DbQueryResult> {
  const { error } = await db.auth.signOut();
  if (error) {
    return { success: false, message: error.message };
  }
  return { success: true, message: "Logout successful", data: undefined };
}

export async function signupUser(
  db: db,
  email: string,
  password: string,
  fullName: string,
  profileType: "STUDENT" | "TEACHER" | "TA"
): Promise<DbQueryResult> {
  const { data: authUserData, error: authError } = await db.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return { success: false, message: authError.message };
  }
  if (!authUserData.user) {
    return { success: false, message: "User not found" };
  }

  const { error: profileError } = await db.from("profiles").insert({
    id: authUserData.user.id,
    fullname: fullName,
    profile_type: profileType,
    email: email,
  });

  if (profileError) {
    console.log(profileError);
    return { success: false, message: profileError.message };
  }

  return { success: true, message: "Signup successful", data: undefined };
}

export async function getCurrentUser(db: db): Promise<DbQueryResult<User>> {
  const { data: userData, error } = await db.auth.getUser();
  const user = userData.user;
  if (error)
    return {
      success: false,
      message: `Authentication error: ${error.message}`,
    };
  if (!user) return { success: false, message: "User not found" };
  return { success: true, message: "User found", data: user };
}

export async function getCurrentProfile(
  db: db
): Promise<DbQueryResult<Profile>> {
  const userQueryResult = await getCurrentUser(db);
  if (!userQueryResult.success)
    return { success: false, message: userQueryResult.message };

  const { data: profileData, error } = await db
    .from("profiles")
    .select("*")
    .eq("id", userQueryResult.data.id)
    .single();
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Profile found", data: profileData };
}
