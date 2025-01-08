import { db, DbQueryResult } from "@/types";
import { ThesisGroupProfile } from "@/types/schema";

export async function getThesisGroupProfileGivenGroupAndProfileId(
  db: db,
  groupId: string,
  profileId: string
): Promise<DbQueryResult<ThesisGroupProfile>> {
  const { data, error } = await db
    .from("thesis_group_profiles")
    .select("*")
    .eq("group_id", groupId)
    .eq("profile_id", profileId)
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Thesis group profile fetched", data };
}

export async function getThesisGroupProfileUsernameGivenId(
  db: db,
  id: string
): Promise<DbQueryResult<Pick<ThesisGroupProfile, "username">>> {
  const { data, error } = await db
    .from("thesis_group_profiles")
    .select("username")
    .eq("id", id)
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Thesis group profile fetched", data };
}

export async function getGroupMembersGivenGroupId(
  db: db,
  groupId: string
): Promise<DbQueryResult<ThesisGroupProfile[]>> {
  const { data, error } = await db
    .from("thesis_group_profiles")
    .select("*")
    .eq("group_id", groupId);
  if (error) {
    return { success: false, message: error.message };
  }
  return { success: true, message: "Group members fetched successfully", data };
}
