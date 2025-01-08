"use client";

import { JoinGroupRequest, ThesisGroupProfileRoleEnum } from "@/types/schema";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { generateRandomName } from "@/utils/helpers";

interface PendingRequestListProps {
  pendingRequests: JoinGroupRequest[];
  groupId: string;
}

const supabase = createClient();

export default function PendingRequestList({
  pendingRequests,
  groupId,
}: PendingRequestListProps) {
  const router = useRouter();
  const handleApprove = async ({
    requestId,
    requestedBy,
    requestedRole,
  }: {
    requestId: string;
    requestedBy: string;
    requestedRole: string;
  }) => {
    toast.loading("Approving request...");
    // Add your approve logic here
    const { error } = await supabase
      .from("join_group_requests")
      .delete()
      .eq("id", requestId);

    if (error) {
      console.error("Error updating request status", error);
      toast.dismiss();
      toast.error("Error approving request");
      return;
    }
    const { error: error2 } = await supabase
      .from("thesis_group_profiles")
      .insert({
        profile_id: requestedBy,
        group_id: groupId,
        role: requestedRole as ThesisGroupProfileRoleEnum,
        username: generateRandomName(),
      });
    if (error2) {
      toast.error("Error creating group profile");
      console.error("Error creating group profile", error2);
      return;
    }
    toast.dismiss();
    toast.success("Request approved successfully");
    router.refresh();
  };

  const handleReject = async (requestId: string) => {
    // Add your reject logic here
    toast.loading("Rejecting request...");
    const { error } = await supabase
      .from("join_group_requests")
      .delete()
      .eq("id", requestId);

    if (error) {
      console.error("Error rejecting request", error);
      toast.error("Error rejecting request");
      return;
    }
    toast.success("Request rejected successfully");
    router.refresh();
  };

  return (
    <div className="grid gap-4">
      {pendingRequests.map((request) => (
        <Card key={request.id}>
          <CardHeader>
            <CardTitle>
              <strong>Requested By:</strong> {request.profiles.fullname}
            </CardTitle>
            <CardDescription>
              <strong>Requested Role:</strong>{" "}
              <Badge>{request.requested_role}</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {request.request_details ? (
              <p className="flex items-center gap-2">
                <strong>
                  <MessageSquare />
                </strong>{" "}
                {request.request_details}
              </p>
            ) : (
              <p>No request message provided by the enthusiast</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => handleReject(request.id)}>
              Reject
            </Button>
            <Button
              onClick={() =>
                handleApprove({
                  requestedBy: request.requested_by,
                  requestedRole: request.requested_role,
                  requestId: request.id,
                })
              }
            >
              Approve
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
