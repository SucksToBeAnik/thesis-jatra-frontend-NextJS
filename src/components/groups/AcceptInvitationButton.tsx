"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { generateRandomName } from "@/utils/helpers";

interface AcceptInvitationButtonProps {
  invitationId: string;
  groupId: string;
  profileId: string;
  role: string;
}

export default function AcceptInvitationButton({
  invitationId,
  groupId,
  profileId,
  role,
}: AcceptInvitationButtonProps) {
  console.log(role)
  const router = useRouter();
  async function handleAcceptInvitation() {
    toast.loading("Accepting invitation...");
    const supabase = createClient();
    const { error } = await supabase
      .from("thesis_group_profiles")
      .insert([
        {
          group_id: groupId,
          profile_id: profileId,
          username: generateRandomName(),
        },
      ]);

    if (error) {
      toast.dismiss();
      toast.error("Error accepting invitation");
      return;
    }
    const { error: error2 } = await supabase
      .from("join_group_invitations")
      .delete()
      .eq("id", invitationId);

    if (error2) {
      console.error("Error updating invitation status", error2);
    }
    toast.dismiss();
    toast.success("Invitation accepted");
    router.refresh();
  }
  return (
    <Button variant={"secondary"} size={"sm"} onClick={handleAcceptInvitation}>
      Accept Invitation
    </Button>
  );
}
