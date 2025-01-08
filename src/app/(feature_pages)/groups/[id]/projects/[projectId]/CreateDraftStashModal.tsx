"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

const formSchema = z.object({
  title: z.string().min(10).max(100),
});
type FormValues = z.infer<typeof formSchema>;

interface CreateDraftStashModalProps {
  projectId: string;
  draftOwner: string;
}

export default function CreateDraftStashModal({
  draftOwner,
  projectId,
}: CreateDraftStashModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
  async function handleFormSubmit(values: FormValues) {
    const formSubmissionPromise = new Promise<string>(
      async (resolve, reject) => {
        try {
          const sb = createClient();
          const { error } = await sb.from("project_drafts").insert({
            title: values.title,
            project_id: projectId,
            draft_owner: draftOwner,
          });
          if (error) {
            reject("Failed to create draft");
          }
          resolve("Draft created successfully");
        } catch (error) {
          reject("Failed to create draft");
        }
      }
    );
    toast.promise(formSubmissionPromise, {
      loading: "Creating draft...",
      success: (message) => {
        setOpen(false);
        router.refresh();
        return message;
      },
      error: (error) => {
        return error;
      },
    });
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Draft</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a draft to you stash</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="A title for your draft" />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4">
              <Button onClick={() => setOpen(false)} variant="default">
                Cancel
              </Button>
              <Button type="submit">Create Draft</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
