import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import ProjectListTabContent from "./ProjectListTabContent";
import GroupChat from "./GroupChat";
import { createClient } from "@/utils/supabase/server";
import { getCurrentProfile } from "@/db-actions/auth";
import EmptyContent from "@/components/global/EmptyContent";
import {
  getThesisGroupProfileGivenGroupAndProfileId,
  getGroupMembersGivenGroupId,
} from "@/db-actions/thesis-group-profiles";
import { getGroupProjects } from "@/db-actions/group-projects";
import MemberList from "./MemberList";
import { getPendingJoinRequestsGivenGroupId } from "@/db-actions/groups";
import PendingRequestList from "./PendingRequestList";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const groupdId = (await params).id;
  console.log(groupdId);
  const db = createClient();
  const profileQueryResult = await getCurrentProfile(db);
  if (!profileQueryResult.success) {
    return (
      <EmptyContent
        message={"No profile has been found to display the content"}
      />
    );
  }

  const [
    groupProjectsQueryResult,
    thesisGroupProfileQueryResult,
    groupMembersQueryResult,
    pendingJoinRequestsQueryResult,
  ] = await Promise.all([
    getGroupProjects(db, groupdId),
    getThesisGroupProfileGivenGroupAndProfileId(
      db,
      groupdId,
      profileQueryResult.data.id
    ),
    getGroupMembersGivenGroupId(db, groupdId),
    getPendingJoinRequestsGivenGroupId(db, groupdId),
  ]);

  if (!thesisGroupProfileQueryResult.success) {
    throw new Error(thesisGroupProfileQueryResult.message);
  }
  if (!groupProjectsQueryResult.success) {
    throw new Error(groupProjectsQueryResult.message);
  }
  if (!groupMembersQueryResult.success) {
    throw new Error(groupMembersQueryResult.message);
  }
  if (!pendingJoinRequestsQueryResult.success) {
    throw new Error(pendingJoinRequestsQueryResult.message);
  }
  return (
    <div className="p-7 w-full grid grid-cols-2 gap-4">
      <Tabs defaultValue="projects" className="col-span-1">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>

          <TabsTrigger value="settings">Pending Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="projects">
          <ProjectListTabContent
            groupProfileName={thesisGroupProfileQueryResult.data.username}
            groupId={groupdId}
            projects={groupProjectsQueryResult.data}
          />
        </TabsContent>
        <TabsContent value="members">
          <MemberList members={groupMembersQueryResult.data} />
        </TabsContent>
        <TabsContent value="settings">
          <PendingRequestList
            pendingRequests={pendingJoinRequestsQueryResult.data}
            groupId={groupdId}
          />
        </TabsContent>
      </Tabs>
      <div className="col-span-1">
        <GroupChat
          groupProfileUsername={thesisGroupProfileQueryResult.data.username}
          groupId={groupdId}
        />
      </div>
    </div>
  );
}
