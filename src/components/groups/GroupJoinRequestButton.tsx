"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "../ui/dialog";

import { Form, FormField, FormItem, FormControl, FormLabel } from "../ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { createClient } from "@/utils/supabase/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addGroupJoinRequest } from "@/db-actions/groups";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const roleEnum = z.enum([
  "SUPERVISOR",
  "COSUPERVISOR",
  "COORDINATOR",
  "AUTHOR",
]);
type Role = z.infer<typeof roleEnum>;

const roles: Role[] = roleEnum.options;

const formSchema = z.object({
  requestDetails: z.string().min(10).max(500),
  requestedRole: roleEnum,
});

interface GroupJoinRequestButtonProps {
  groupId: string;
}

export default function GroupJoinRequestButton({
  groupId,
}: GroupJoinRequestButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestDetails: "",
      requestedRole: "AUTHOR",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formSumissionPromise = new Promise<string>(
      async (resolve, reject) => {
        try {
          const supabase = createClient();
          console.log(values);

          const [data, error] = await addGroupJoinRequest({
            requestDetails: values.requestDetails,
            requestedRole: values.requestedRole,
            db: supabase,
            groupId: groupId,
          });
          if (data) {
            resolve(data);
          }
          if (error) {
            console.log(error);
            reject(error);
          }
        } catch (error) {
          reject(error);
        }
      }
    );

    toast.promise(formSumissionPromise, {
      loading: "Submitting request...",
      success: (data: string) => {
        setOpen(false);
        form.reset();
        router.refresh();
        return data;
      },
      error: "Error submitting request",
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Send Join Request</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Group</DialogTitle>
          <DialogDescription>Request to join this group</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="requestDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request Details</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requestedRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requested Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-4">
              Submit Request
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
