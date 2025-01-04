import {
  ThesisGroupProfileWithGroups,
  PendingJoinInvitationsWithGroupData,
  PendingJoinRequestsWithGroupData,
} from "@/types/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { InfoIcon } from "lucide-react";
import GroupJoinRequestCancelButton from "./GroupJoinRequestCancelButton";

interface PersonalGroupsProps {
  groups: ThesisGroupProfileWithGroups[];
  pendingJoinInvitations: PendingJoinInvitationsWithGroupData[];
  pendingJoinRequests: PendingJoinRequestsWithGroupData[];
}

export default function PersonalGroups({
  groups,
  pendingJoinInvitations,
  pendingJoinRequests,
}: PersonalGroupsProps) {
  return (
    <div className="flex flex-col gap-4 h-[80vh]">
      {/* this section for the groups */}
      <div className="h-2/3">
        <h1 className="text-2xl font-bold mb-4">My Groups</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.length > 0 ? (
            groups.map((group) => (
              <Card key={group.id}>
                <CardHeader className="p-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>{group.thesis_groups.name}</CardTitle>
                    <Badge className="text-xs lowercase" variant="secondary">
                      {group.role}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between p-2">
                  <Button variant="default" size="sm">
                    Visit Group →
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div>No groups found</div>
          )}
        </div>
      </div>
      {/* this section for the pending join invitations and requests */}
      <Tabs defaultValue="invitations" className="h-1/3 overflow-y-auto">
        <TabsList>
          <TabsTrigger value="invitations">Join Invitations</TabsTrigger>
          <TabsTrigger value="requests">Sent Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="invitations" className="overflow-y-auto">
          {pendingJoinInvitations.length > 0 ? (
            <div className="flex flex-col gap-4 overflow-y-auto">
              {pendingJoinInvitations.map((invitation) => (
                <Card key={invitation.id} className="w-1/2 h-[180px]">
                  <CardHeader className="pb-2">
                    <CardTitle>{invitation.thesis_groups.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-start gap-2 bg-primary-foreground p-2 rounded-md">
                      <InfoIcon className="w-5 h-5" />
                      <p className="text-sm truncate">
                        {invitation.invitation_details}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" className="">
                        Accept
                      </Button>
                      <Button size="sm" variant="secondary" className="">
                        Decline
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No pending join invitations
            </div>
          )}
        </TabsContent>
        <TabsContent value="requests">
          {pendingJoinRequests.length > 0 ? (
            <div className="flex flex-col gap-4 overflow-y-auto">
              {pendingJoinRequests.map((request) => (
                <Card className="w-1/2 h-[180px]" key={request.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>
                      {request.thesis_groups?.name || "N/A"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-start gap-2 bg-primary-foreground p-2 rounded-md">
                      <InfoIcon className="w-5 h-5" />
                      <p className="text-sm truncate">
                        {request.request_details}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <GroupJoinRequestCancelButton requestId={request.id} />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No pending join requests
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
