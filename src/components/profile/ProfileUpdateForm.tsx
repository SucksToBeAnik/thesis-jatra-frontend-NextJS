"use client";

import { Profile } from "@/types/schema";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { uploadProfileImage } from "@/db-actions/storage";
import { updateProfileGivenId } from "@/db-actions/profiles";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProfileUpdateFormProps {
  profile: Profile;
}
const profileUpdateSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters." })
    .max(50, { message: "Full name must be at most 50 characters." }),
  bio: z
    .string()
    .min(3, { message: "Bio must be at least 3 characters." })
    .max(500, { message: "Bio must be at most 500 characters." }),
  profileImage: z.custom<FileList>(),
});

export default function ProfileUpdateForm({ profile }: ProfileUpdateFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof profileUpdateSchema>>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: profile.fullname,
      bio: profile.bio || "",
      profileImage: undefined,
    },
  });
  const onSubmit = async (values: z.infer<typeof profileUpdateSchema>) => {
    toast.loading("Updating profile...");
    const supabase = createClient();
    const imageToUpload = values.profileImage[0];
    let profileImageUrl: string | undefined = undefined;
    if (imageToUpload) {
      const uploadResult = await uploadProfileImage(
        supabase,
        profile.id,
        imageToUpload
      );
      if (!uploadResult.success) {
        toast.error(uploadResult.message);
        toast.dismiss();
        return;
      }
      profileImageUrl = uploadResult.data;
    }
    const updateResult = await updateProfileGivenId(supabase, profile.id, {
      fullname: values.fullName,
      bio: values.bio,
      profile_image_url: profileImageUrl,
    });
    if (!updateResult.success) {
      toast.error(updateResult.message);
      toast.dismiss();
      return;
    }
    toast.success(updateResult.message);
    router.refresh();
    toast.dismiss();
  };
  return (
    <Card className="border-none shadow-md dark:shadow-gray-900">
      <CardHeader>
        <CardTitle>Update Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex justify-between items-center mb-10 gap-4">
              <Avatar className="w-28 h-28">
                <AvatarImage
                  className="object-cover"
                  src={profile.profile_image_url || ""}
                />
                <AvatarFallback>
                  {profile.fullname.split(" ")[0][0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2 flex-1">
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-muted-foreground">
                    Profile Image
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      {...form.register("profileImage")}
                    />
                  </FormControl>
                </FormItem>
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Stranger"
                      {...form.register("fullName")}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.fullName?.message}
                  </FormMessage>
                </FormItem>
              </div>
            </div>

            <FormItem>
              <FormLabel className="flex items-center gap-2 text-muted-foreground">
                <MessageSquare className="w-4 h-4" />
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none h-24"
                  placeholder="Write something about yourself..."
                  {...form.register("bio")}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.bio?.message}</FormMessage>
            </FormItem>
            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              className="w-full"
            >
              {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
