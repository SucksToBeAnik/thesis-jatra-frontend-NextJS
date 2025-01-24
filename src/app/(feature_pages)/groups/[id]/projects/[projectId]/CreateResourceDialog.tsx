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
import { v4 as uuidv4 } from "uuid";

const ACCEPTED_FILE_TYPES = ["application/pdf"] as const;

const formSchema = z.object({
  title: z.string().min(10).max(100),
  resourceUrl: z.string().optional(),
  resourceFile: z.custom<FileList>().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

interface CreateResourceDialogProps {
  projectId: string;
}

export default function CreateResourceDialog({
  projectId,
}: CreateResourceDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      resourceUrl: "",
    },
  });
  async function handleFormSubmit(values: FormValues) {
    const formSubmissionPromise = new Promise<string>(
      async (resolve, reject) => {
        try {
          const sb = createClient();
          let fileId;
          if (values.resourceFile) {
            const file = values.resourceFile[0];
            fileId = uuidv4();
            const { error } = await sb.storage
              .from("resources")
              .upload(`resources/${projectId}/${fileId}`, file);
            if (error) {
              console.log(error);
              reject("Failed to upload file");
              return;
            }
          }
          const { error } = await sb.from("project_resources").insert({
            title: values.title,
            project_id: projectId,
            resource_url: values.resourceUrl,
            id: fileId,
          });
          if (error) {
            reject("Failed to create resource");
          }
          resolve("Resource created successfully");
        } catch (error) {
          console.error(error);
          reject("Failed to create resource");
        }
      }
    );

    toast.promise(formSubmissionPromise, {
      loading: "Creating resource...",
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
        <Button size={"sm"} variant="default">
          Add Resource
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Resource</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleFormSubmit)}
          >
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="title">Title*</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="A title for your resource" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="resourceUrl"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="title">Resource URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Optionally provide the url for your resource"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="resourceFile"
              control={form.control}
              render={({ }) => (
                <FormItem>
                  <FormLabel htmlFor="title">Upload resource</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      placeholder="Upload a file. Only PDF files are allowed"
                      accept={ACCEPTED_FILE_TYPES.join(",")}
                      {...form.register("resourceFile")}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" variant="default">
              Add Resource
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
