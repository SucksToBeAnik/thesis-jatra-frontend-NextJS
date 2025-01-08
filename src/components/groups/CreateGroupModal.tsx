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
  name: z.string().min(3).max(50),
  bio: z.string().min(10).max(500),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateGroupModalProps {
  profileId: string;
  userName: string;
}

export default function CreateGroupModal({
  profileId,
  userName,
}: CreateGroupModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bio: "",
    },
  });
  async function handleFormSubmit(values: FormValues) {
    const formSubmissionPromise = new Promise<string>(
      async (resolve, reject) => {
        try {
          const sb = createClient();
          const { data, error } = await sb
            .from("thesis_groups")
            .insert({
              name: values.name,
              bio: values.bio,
            })
            .select("id")
            .single();
          if (error || !data) {
            reject("Failed to create draft");
            return;
          }
          const { error: error2 } = await sb
            .from("thesis_group_profiles")
            .insert({
              group_id: data.id,
              profile_id: profileId,
              username: userName,
              role: "COORDINATOR",
            });
          if (error2) {
            reject("Failed to create group");
          }
          resolve("A new group created successfully");
        } catch (error) {
          reject("Failed to create draft");
        }
      }
    );
    toast.promise(formSubmissionPromise, {
      loading: "Creating Group...",
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
        <Button>Create Group</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create your own group</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="A name for your group" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your group description" />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4">
              <Button onClick={() => setOpen(false)} variant="default">
                Cancel
              </Button>
              <Button type="submit">Create Group</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
