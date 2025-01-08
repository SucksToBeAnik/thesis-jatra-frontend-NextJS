import { DbQueryResult, db } from "@/types";
import { GroupProject } from "@/types/schema";

export async function getGroupProjects(
  db: db,
  groupId: string
): Promise<DbQueryResult<GroupProject[]>> {
  const { data, error } = await db
    .from("group_projects")
    .select("*")
    .eq("group_id", groupId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Group projects fetched", data };
}

export async function createGroupProject(
  db: db,
  projectData: {
    group_id: string;
    name: string;
    description: string;
  }
): Promise<DbQueryResult> {
  const { error } = await db.from("group_projects").insert(projectData);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Group project created", data: undefined };
}
