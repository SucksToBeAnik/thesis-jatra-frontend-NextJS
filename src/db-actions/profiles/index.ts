import { db, DbQueryResult } from "@/types";

export async function updateProfileGivenId(
  db: db,
  id: string,
  profileData: {
    fullname: string;
    bio: string;
    profile_image_url?: string;
  }
): Promise<DbQueryResult> {
  const { error } = await db.from("profiles").update(profileData).eq("id", id);
  if (error) {
    return {
      message: error.message,
      success: false,
    };
  }
  return {
    message: "Profile updated successfully",
    success: true,
    data: undefined,
  };
}
