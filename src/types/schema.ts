import { Database } from "./supabase";
import { createClient } from "@/utils/supabase/server";
import { QueryData } from "@supabase/supabase-js";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ThesisGroup = Database["public"]["Tables"]["thesis_groups"]["Row"];
export type ThesisGroupProfile =
  Database["public"]["Tables"]["thesis_group_profiles"]["Row"];
export type JoinGroupRequest =
  Database["public"]["Tables"]["join_group_requests"]["Row"];
export type JoinGroupInvitation =
  Database["public"]["Tables"]["join_group_invitations"]["Row"];
export type GroupMessage =
  Database["public"]["Tables"]["group_messages"]["Row"];
export type GroupProject =
  Database["public"]["Tables"]["group_projects"]["Row"];
export type Draft = Database["public"]["Tables"]["project_drafts"]["Row"];
export type Resource = Database["public"]["Tables"]["project_resources"]["Row"];
export type ThesisGroupProfileRoleEnum =
  Database["public"]["Enums"]["thesis_group_role"];

// custom query types
const supabase = createClient();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getThesisGroupProfileWithGroups = supabase
  .from("thesis_group_profiles")
  .select("*,thesis_groups(*)")
  .eq("profile_id", "")
  .maybeSingle();

export type ThesisGroupProfileWithGroups = QueryData<
  typeof getThesisGroupProfileWithGroups
>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getPendingJoinInvitationsWithGroupData = supabase
  .from("join_group_invitations")
  .select("*,thesis_groups(*)")
  .eq("desired_profile_id", "")
  .eq("invitation_status", "PENDING")
  .maybeSingle();
export type PendingJoinInvitationsWithGroupData = QueryData<
  typeof getPendingJoinInvitationsWithGroupData
>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getPendingJoinRequestsWithGroupData = supabase
  .from("join_group_requests")
  .select("*,thesis_groups(*)")
  .eq("requested_by", "")
  .eq("request_status", "PENDING")
  .maybeSingle();
export type PendingJoinRequestsWithGroupData = QueryData<
  typeof getPendingJoinRequestsWithGroupData
>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getPublicDraftsWithMemberNames = supabase
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
  .single();
export type PublicDraftsWithMemberNames = QueryData<
  typeof getPublicDraftsWithMemberNames
>;


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getPendingJoinRequestsWithProfiles = supabase
.from("join_group_requests")
.select("*,profiles(*)")
.single();
export type PendingJoinRequestsWithProfiles = QueryData<
  typeof getPendingJoinRequestsWithProfiles
>;
// -------end of custom query types-------
