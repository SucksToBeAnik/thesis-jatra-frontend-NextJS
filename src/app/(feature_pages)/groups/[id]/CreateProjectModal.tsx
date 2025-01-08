"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormLabel,
  FormItem,
  FormField,
} from "@/components/ui/form";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createGroupProject } from "@/db-actions/group-projects";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().min(10).max(500),
});
type FormValues = z.infer<typeof formSchema>;

interface CreateProjectDialogProps {
  groupId: string;
}

export default function CreateProjectDialog({
  groupId,
}: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function handleSubmit(values: FormValues) {
    const formSubmissionPromise = new Promise<string>(
      async (resolve, reject) => {
        try {
          const sb = createClient();

          const groupCreationResult = await createGroupProject(sb, {
            group_id: groupId,
            name: values.name,
            description: values.description,
          });
          if (!groupCreationResult.success) {
            throw new Error(groupCreationResult.message);
          }
          resolve(groupCreationResult.message);
        } catch (error) {
          if (error instanceof Error) {
            reject(error.message);
          } else {
            reject("An error occurred");
          }
        }
      }
    );

    toast.promise(formSubmissionPromise, {
      loading: "Creating project...",
      success: (message: string) => {
        setOpen(false);
        router.refresh();
        return message;
      },
      error: (message: string) => {
        return message;
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"} size={"sm"}>Add New Project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Project Details</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Project Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter project name" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="description">
                    Project Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter project description"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? "Creating project..." : "Create"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
