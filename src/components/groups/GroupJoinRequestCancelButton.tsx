"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { deleteGroupJoinRequest } from "@/db-actions/groups";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface GroupJoinRequestCancelButtonProps {
  requestId: string;
}
export default function GroupJoinRequestCancelButton({
  requestId,
}: GroupJoinRequestCancelButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    toast.loading("Cancelling join request...");
    const supabase = createClient();
    const [data, error] = await deleteGroupJoinRequest({
      db: supabase,
      requestId: requestId,
    });
    if (error) {
      toast.error("Error cancelling join request");
      return;
    }
    setOpen(false);
    toast.success(data);
    router.refresh();
    setTimeout(() => {
      toast.dismiss();
    }, 3000);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button size={"sm"} variant="destructive">
          Cancel Join Request
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Cancel Join Request</DialogTitle>
        <p>Are you sure you want to cancel your request to join the group?</p>
        <div className="flex justify-end gap-4">
          <Button onClick={() => setOpen(false)} variant="default">
            Close
          </Button>
          <Button onClick={handleDelete} variant="destructive">
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
