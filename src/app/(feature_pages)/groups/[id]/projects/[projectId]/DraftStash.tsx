"use client";

import { useState } from "react";
import { Draft } from "@/types/schema";
import DraftEditor from "./DraftEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CreateDraftStashModal from "./CreateDraftStashModal";
import PublishDraftModal from "./PublishDraftModal";

interface DraftStashProps {
  drafts: Draft[];
  currentGroupProfileUsername: string;
  projectId: string;
}

export default function DraftStash({
  drafts,
  currentGroupProfileUsername,
  projectId,
}: DraftStashProps) {
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const router = useRouter();

  async function handleDeleteDraft(draftId: string) {
    if (!selectedDraft) return;
    toast.loading("Deleting draft...");
    // Delete the selected draft
    const supabase = createClient();
    // check if the the current user is the owner of the draft
    const { error } = await supabase
      .from("project_drafts")
      .delete()
      .eq("id", draftId);
    if (error) {
      toast.error("Failed to delete draft");
      return;
    }
    toast.success("Draft deleted successfully");
    router.refresh();
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold mb-6">Your project drafts</h1>
        <CreateDraftStashModal
          projectId={projectId}
          draftOwner={currentGroupProfileUsername}
        />
      </div>

      <div className="grid grid-cols-3 w-full gap-6 h-[calc(100vh-200px)]">
        {/* Drafts List */}
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-300px)]">
                {drafts.length > 0 ? (
                  <div className="space-y-2">
                    {drafts.map((draft) => (
                      <div
                        key={draft.id}
                        onClick={() => setSelectedDraft(draft)}
                        className={`p-4 rounded-lg cursor-pointer transition-colors
                          ${
                            selectedDraft?.id === draft.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-secondary"
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <h2 className="font-semibold mb-1">{draft.title}</h2>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDraft(draft.id);
                            }}
                            size="icon"
                            variant="destructive"
                            className="p-1"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="line-clamp-2 text-muted-foreground text-xs">
                          Created by {currentGroupProfileUsername}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No drafts found</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Editor Section */}
        <div className="col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>
                {selectedDraft ? "Edit Draft" : "Select a draft to edit"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDraft ? (
                <div className="flex flex-col h-[calc(100vh-300px)] space-y-16">
                  <DraftEditor draft={selectedDraft} />
                  <PublishDraftModal
                    isPublic={selectedDraft.is_public}
                    draftId={selectedDraft.id}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-[calc(100vh-400px)]">
                  <p className="text-muted-foreground">
                    Select a draft from the list to start editing
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
