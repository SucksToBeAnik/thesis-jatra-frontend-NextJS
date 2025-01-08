import EmptyContent from "@/components/global/EmptyContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/utils/supabase/server";
import DraftStash from "./DraftStash";
import { getDraftsGivenProjectId } from "@/db-actions/project-drafts";
import { getResourcesGivenProjectId } from "@/db-actions/project-resources";
import ResourceStash from "./ResourceStash";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; projectId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const groupId = (await params).id;
  const projectId = (await params).projectId;
  const groupProfileUsername = (await searchParams)
    .groupProfileUsername as string;
  // console.log(groupId, projectId, groupProfileId);
  if (!groupProfileUsername) {
    <EmptyContent message="Your profile for this group cound not be detected" />;
  }
  const db = createClient();

  const [draftsQueryRes, resourcesQueryRes] = await Promise.all([
    getDraftsGivenProjectId(db, projectId),
    getResourcesGivenProjectId(db, projectId),
  ]);

  if (!draftsQueryRes.success) {
    throw new Error(draftsQueryRes.message);
  }
  if (!resourcesQueryRes.success) {
    throw new Error(resourcesQueryRes.message);
  }
  const drafts = draftsQueryRes.data;

  return (
    <div className="p-7 w-full">
      <Tabs defaultValue="draft">
        <div className="flex justify-between items-center my-4">
          <TabsList>
            <TabsTrigger value="draft">Draft Stash</TabsTrigger>
            <TabsTrigger value="resource">Resource Stash</TabsTrigger>
          </TabsList>
          <Button variant={"link"}>
            <Link href={`/groups/${groupId}`}>Go back to group</Link>
          </Button>
        </div>

        <TabsContent value="draft">
          <DraftStash
            projectId={projectId}
            drafts={drafts}
            currentGroupProfileUsername={groupProfileUsername}
          />
        </TabsContent>
        <TabsContent value="resource">
          <ResourceStash
            projectId={projectId}
            resources={resourcesQueryRes.data}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
