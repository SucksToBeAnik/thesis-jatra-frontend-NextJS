"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { signupUser } from "@/db-actions/auth";
import { useRouter } from "next/navigation";
import { Mail, User, UserCheck, LockIcon } from "lucide-react";

export default function SignupFormDialog() {
  const router = useRouter();
  const signupSchema = z.object({
    email: z.string().email(),
    fullName: z.string().min(3),
    profileType: z.enum(["STUDENT", "TEACHER", "TA"]),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  });
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      fullName: "",
      profileType: "STUDENT",
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    toast.loading("Signing up...");
    const supabase = createClient();
    const { success, message } = await signupUser(
      supabase,
      values.email,
      values.password,
      values.fullName,
      values.profileType
    );
    if (success) {
      setTimeout(() => {
        router.push("/profile");
      }, 500);
      toast.success(message);
    } else {
      toast.error(message);
    }
    toast.dismiss();
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">Signup</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle>Create an account</DialogTitle>
          <DialogDescription>
            Please fill in the form below to signup to our platform
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="stranger@gmail.com"
                  {...form.register("email")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </FormLabel>
              <FormControl>
                <Input placeholder="Stranger" {...form.register("fullName")} />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                Profile Type
              </FormLabel>
              <FormControl>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Profile Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="TEACHER">Teacher</SelectItem>
                    <SelectItem value="TA">TA</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <LockIcon className="w-4 h-4" />
                Password
              </FormLabel>
              <FormControl>
                <Input placeholder="********" {...form.register("password")} />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <LockIcon className="w-4 h-4" />
                Confirm Password
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="********"
                  {...form.register("confirmPassword")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            <Button type="submit">Signup</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
