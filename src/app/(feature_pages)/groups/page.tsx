import {
  getGroupsGivenProfileId,
  getPendingJoinRequests,
  getPendingJoinInvitations,
} from "@/db-actions/groups";
import { getCurrentProfile } from "@/db-actions/auth";
import { createClient } from "@/utils/supabase/server";
import PersonalGroups from "@/components/groups/PersonalGroups";
import PublicGroupList from "@/components/groups/PublicGroupList";
import CreateGroupModal from "@/components/groups/CreateGroupModal";
import { v4 as uuidv4 } from "uuid";

export default async function Page() {
  const supabase = createClient();
  const profileQueryResult = await getCurrentProfile(supabase);
  if (!profileQueryResult.success) {
    throw new Error(profileQueryResult.message);
  }

  const [
    pendingJoinInvitationsQueryResult,
    pendingJoinRequestsQueryResult,
    groupsQueryResult,
  ] = await Promise.all([
    getPendingJoinInvitations(supabase, profileQueryResult.data.id),
    getPendingJoinRequests(supabase, profileQueryResult.data.id),
    getGroupsGivenProfileId(supabase, profileQueryResult.data.id),
  ]);

  if (
    !groupsQueryResult.success ||
    !pendingJoinInvitationsQueryResult.success ||
    !pendingJoinRequestsQueryResult.success
  ) {
    throw new Error(
      groupsQueryResult.message ||
        pendingJoinInvitationsQueryResult.message ||
        pendingJoinRequestsQueryResult.message
    );
  }
  function generateRandomName() {
    const adjectives = [
      "Red",
      "Blue",
      "Green",
      "Yellow",
      "Purple",
      "Orange",
      "Pink",
      "Black",
      "White",
      "Grey",
    ];
    const nouns = [
      "Dog",
      "Cat",
      "Bird",
      "Fish",
      "Elephant",
      "Giraffe",
      "Lion",
      "Tiger",
      "Bear",
      "Wolf",
    ];
    return (
      adjectives[Math.floor(Math.random() * adjectives.length)] +
      " " +
      nouns[Math.floor(Math.random() * nouns.length)] +
      uuidv4().slice(0, 4)
    );
  }
  return (
    <div className="p-7 w-full">
      <div className="flex items-start justify-between">
        <h1 className="text-3xl font-bold mb-8">Thesis Group Stash</h1>
        <CreateGroupModal
          profileId={profileQueryResult.data.id}
          userName={generateRandomName()}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2">
          <PersonalGroups
            groups={groupsQueryResult.data}
            pendingJoinInvitations={pendingJoinInvitationsQueryResult.data}
            pendingJoinRequests={pendingJoinRequestsQueryResult.data}
          />
        </div>
        <div className="col-span-1">
          <PublicGroupList />
        </div>
      </div>
    </div>
  );
}
