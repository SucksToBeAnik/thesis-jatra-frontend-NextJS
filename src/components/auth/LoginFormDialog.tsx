"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { loginWithPassword } from "@/db-actions/auth";
import { Mail, LockIcon } from "lucide-react";

export default function LoginFormDialog() {
  const router = useRouter();
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    console.log(values);
    toast.loading("Logging in...");
    const supabase = createClient();
    const result = await loginWithPassword(
      supabase,
      values.email,
      values.password
    );
    if (result.success) {
      setTimeout(() => {
        router.push("/groups");
      }, 500);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    toast.dismiss();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">Login</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle>Login</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </FormLabel>
              <FormControl>
                <Input {...form.register("email")} />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <LockIcon className="w-4 h-4" />
                Password
              </FormLabel>
              <FormControl>
                <Input {...form.register("password")} />
              </FormControl>
              <FormMessage />
            </FormItem>
            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
