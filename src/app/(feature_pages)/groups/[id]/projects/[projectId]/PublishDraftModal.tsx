"use client";

import { createClient } from "@/utils/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PublishDraftModalProps {
  isPublic: boolean;
  draftId: string;
}

export default function PublishDraftModal({
  draftId,
  isPublic,
}: PublishDraftModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  async function handleDraftPublish() {
    toast.loading(`${isPublic ? "Unpublishing" : "Publishing"} draft...`);
    const sb = createClient();
    const { error } = await sb
      .from("project_drafts")
      .update({
        is_public: !isPublic,
      })
      .eq("id", draftId);
    if (error) {
      console.error("Failed to publish draft");
      toast.error(`Failed to ${isPublic ? "unpublish" : "publish"} draft`);
      return;
    }
    toast.success(
      `Draft ${isPublic ? "unpublished" : "published"} successfully`
    );
    setOpen(false);
    router.refresh();
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          {isPublic ? "Unpublish Draft" : "Publish Draft"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isPublic ? "Unpublish Draft" : "Publish Draft"}
          </DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to {isPublic ? "unpublish" : "publish"} this
          draft?
        </p>
        <DialogFooter className="flex justify-end gap-4">
          <Button onClick={() => setOpen(false)} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleDraftPublish} variant="default">
            Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
