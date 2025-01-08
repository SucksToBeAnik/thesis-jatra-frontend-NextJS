import { db } from "../../types";
import { DbQueryResult } from "../../types";
import { GroupMessage } from "../../types/schema";

export async function getGroupMessages(
  db: db,
  groupId: string
): Promise<DbQueryResult<GroupMessage[]>> {
  const { data, error } = await db
    .from("group_messages")
    .select("*")
    .eq("group_id", groupId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Group messages fetched", data };
}
