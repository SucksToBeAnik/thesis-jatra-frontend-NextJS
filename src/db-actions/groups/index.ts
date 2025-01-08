import {
  ThesisGroup,
  ThesisGroupProfileWithGroups,
  PendingJoinInvitationsWithGroupData,
  PendingJoinRequestsWithGroupData,
  JoinGroupRequest,
} from "@/types/schema";
import { db, DbQueryResult } from "@/types";
import { currentAuthUserProc } from "../auth";
import { z } from "zod";

// TODO: Needs further modification
export const getUserSpecificOpenToJoinGroups = currentAuthUserProc
  .createServerAction()
  .input(z.object({ db: z.custom<db>() }))
  .output(z.custom<ThesisGroup[]>())
  .handler(async ({ input: { db }, ctx: user }) => {
    try {
      const { data: groups, error: groupsFetchError } = await db
        .from("thesis_groups")
        .select("*")
        .eq("open_to_join", true);

      if (groupsFetchError) {
        throw new Error(groupsFetchError.message);
      }
      const { data: existingGroupIds, error: existingGroupIdFetchError } =
        await db
          .from("join_group_requests")
          .select("desired_group_id")
          .eq("requested_by", user.id)
          .eq("request_status", "PENDING");

      if (existingGroupIdFetchError) {
        throw new Error(existingGroupIdFetchError.message);
      }
      const filteredGroups = groups.filter((group) => {
        return !existingGroupIds.some((id) => id.desired_group_id === group.id);
      });

      return filteredGroups;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  });

export async function getGroupsGivenProfileId(
  db: db,
  profileId: string
): Promise<DbQueryResult<ThesisGroupProfileWithGroups[]>> {
  const { data, error } = await db
    .from("thesis_group_profiles")
    .select("*,thesis_groups(*)")
    .eq("profile_id", profileId);
  if (error) {
    return { success: false, message: error.message };
  }
  return { success: true, message: "Groups fetched successfully", data: data };
}

export async function getPendingJoinInvitations(
  db: db,
  profileId: string
): Promise<DbQueryResult<PendingJoinInvitationsWithGroupData[]>> {
  const { data, error } = await db
    .from("join_group_invitations")
    .select("*,thesis_groups(*)")
    .eq("desired_profile_id", profileId)
    .eq("invitation_status", "PENDING");
  if (error) {
    return { success: false, message: error.message };
  }
  return {
    success: true,
    message: "Pending join invitations fetched successfully",
    data: data,
  };
}

export async function getPendingJoinRequests(
  db: db,
  profileId: string
): Promise<DbQueryResult<PendingJoinRequestsWithGroupData[]>> {
  const { data, error } = await db
    .from("join_group_requests")
    .select("*,thesis_groups(*)")
    .eq("requested_by", profileId)
    .eq("request_status", "PENDING");
  if (error) {
    return { success: false, message: error.message };
  }
  return {
    success: true,
    message: "Pending join requests fetched successfully",
    data: data,
  };
}

export async function getPendingJoinRequestsGivenGroupId(
  db: db,
  groupId: string
): Promise<DbQueryResult<JoinGroupRequest[]>> {
  const { data, error } = await db
    .from("join_group_requests")
    .select("*,profiles(*)")
    .eq("desired_group_id", groupId)
    .eq("request_status", "PENDING");
  if (error) {
    return { success: false, message: error.message };
  }
  return {
    success: true,
    message: "Pending join requests fetched successfully",
    data: data,
  };
}

// UPDATE Queries
export const addGroupJoinRequest = currentAuthUserProc
  .createServerAction()
  .input(
    z.object({
      groupId: z.string(),
      requestDetails: z.string().min(10).max(500),
      requestedRole: z.enum([
        "SUPERVISOR",
        "COSUPERVISOR",
        "COORDINATOR",
        "AUTHOR",
      ]),
      db: z.custom<db>(),
    })
  )
  .handler(
    async ({
      input: { groupId, requestDetails, requestedRole, db },
      ctx: user,
    }) => {
      console.log("user", user);
      try {
        // check if user is already a member of the group
        const { data, error: userExistError } = await db
          .from("thesis_group_profiles")
          .select("*")
          .eq("group_id", groupId)
          .eq("profile_id", user.id)
          .maybeSingle();
        if (userExistError) {
          console.log("userExistError", userExistError);
          throw new Error(userExistError.message);
        }
        if (data) {
          console.log("data", data);
          throw new Error("User is already a member of this group");
        }
        const { error } = await db.from("join_group_requests").insert({
          desired_group_id: groupId,
          requested_by: user.id,
          request_details: requestDetails,
          requested_role: requestedRole,
          request_status: "PENDING",
        });
        if (error) {
          throw new Error(error.message);
        }
        return "Request sent successfully";
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error("An unknown error occurred");
      }
    }
  );

// DELETE Queries
export const deleteGroupJoinRequest = currentAuthUserProc
  .createServerAction()
  .input(
    z.object({
      requestId: z.string(),
      db: z.custom<db>(),
    })
  )
  .handler(async ({ input: { requestId, db } }) => {
    try {
      const { error } = await db
        .from("join_group_requests")
        .delete()
        .eq("id", requestId);
      if (error) {
        throw new Error(error.message);
      }
      return "Request deleted successfully";
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  });
