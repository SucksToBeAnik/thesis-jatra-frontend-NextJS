import { DbQueryResult, db } from "@/types";

export async function uploadProfileImage(
  db: db,
  id: string,
  file: File
): Promise<DbQueryResult<string>> {
  const { data: uploadData, error } = await db.storage
    .from("images")
    .upload(`profile_pictures/${id}`, file, {
      upsert: true,
    });
  if (error) {
    return {
      message: error.message,
      success: false,
    };
  }
  const publicUrlData = db.storage.from("images").getPublicUrl(uploadData.path);
  return {
    message: "Profile image uploaded successfully",
    success: true,
    data: publicUrlData.data.publicUrl,
  };
}
