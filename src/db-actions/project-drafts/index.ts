import { db, DbQueryResult } from "@/types";
import { Draft, PublicDraftsWithMemberNames } from "@/types/schema";

export async function getDraftsGivenProjectId(
  db: db,
  projectId: string
): Promise<DbQueryResult<Draft[]>> {
  const { data, error } = await db
    .from("project_drafts")
    .select("*")
    .eq("project_id", projectId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Drafts fetched", data };
}

export async function updateDraftContentGivenId(
  db: db,
  id: string,
  content: string
): Promise<DbQueryResult> {
  const { error } = await db
    .from("project_drafts")
    .update({ content })
    .eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Draft updated", data: undefined };
}

export async function getPublicDrafts(
  db: db
): Promise<DbQueryResult<PublicDraftsWithMemberNames[]>> {
  try {
    // Fetch public drafts with their group project details
    const { data: drafts, error: draftsError } = await db
      .from("project_drafts")
      .select(
        `
        *,
        group_projects (
          *,
          thesis_groups(
          *,
            thesis_group_profiles(*)
          )
        )
      `
      )
      .eq("is_public", true);

    if (draftsError) {
      return {
        success: false,
        message: `Error fetching drafts: ${draftsError.message}`,
      };
    }

    if (!drafts) {
      return {
        success: true,
        message: "No public drafts found",
        data: [],
      };
    }

    return {
      success: true,
      message: "Public drafts fetched successfully",
      data: drafts,
    };
  } catch (error) {
    return {
      success: false,
      message: `Unexpected error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export async function getPublicDraftGivenDraftId(
  db: db,
  draftId: string
): Promise<DbQueryResult<PublicDraftsWithMemberNames>> {
  try {
    // Fetch public draft with its group project details
    const { data: draft, error: draftError } = await db
      .from("project_drafts")
      .select(
        `
        *,
        group_projects (
          *,
          thesis_groups(
          *,
            thesis_group_profiles(*)
          )
        )
      `
      )
      .eq("is_public", true)
      .eq("id", draftId)
      .single(); // Changed from .single to .single()

    if (draftError) {
      return {
        success: false,
        message: `Error fetching draft: ${draftError.message}`,
      };
    }

    // if (!draft) {
    //   return {
    //     success: true,
    //     message: "Draft not found",
    //     data: {},  // Changed from empty object to null
    //   };
    // }

    return {
      success: true,
      message: "Draft fetched successfully",
      data: draft,
    };
  } catch (error) {
    return {
      success: false,
      message: `Unexpected error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}
