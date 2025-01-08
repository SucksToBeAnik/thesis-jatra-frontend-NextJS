import { db, DbQueryResult } from "@/types";
import { Resource } from "@/types/schema";

export async function getResourcesGivenProjectId(
  db: db,
  projectId: string
): Promise<DbQueryResult<Resource[]>> {
  const { data, error } = await db
    .from("project_resources")
    .select("*")
    .eq("project_id", projectId);
  if (error) {
    return { success: false, message: error.message };
  }
  return { success: true, message: "Resources fetched", data };
}
