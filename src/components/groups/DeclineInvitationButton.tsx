"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeclineInvitationButtonProps {
  invitationId: string;
}

export default function DeclineInvitationButton({
  invitationId,
}: DeclineInvitationButtonProps) {
  const router = useRouter();
  async function handleDeclineInvitation() {
    toast.loading("Declining invitation...");
    const supabase = createClient();
    // Add your decline logic here
    const { error } = await supabase
      .from("join_group_invitations")
      .delete()
      .eq("id", invitationId);
    if (error) {
      toast.dismiss();
      toast.error("Error declining invitation");
      return;
    }
    toast.dismiss();
    toast.success("Invitation declined");
    router.refresh();
  }
  return (
    <Button size={"sm"} variant={"secondary"} onClick={handleDeclineInvitation}>
      Decline Invitation
    </Button>
  );
}
