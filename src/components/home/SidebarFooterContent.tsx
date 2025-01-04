"use client";

import { ToggleTheme } from "@/components/global/ToggleTheme";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { logout } from "@/db-actions/auth";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";


interface SidebarFooterContentProps {
  fullname: string;
  email?: string;
  profileType?: "STUDENT" | "TEACHER" | "TA";
  profileImage?: string;
}

export default function SidebarFooterContent({
  fullname,
  email,
  profileType,
  profileImage,
}: SidebarFooterContentProps) {
  const router = useRouter();
  const handleLogout = async () => {
    toast.loading("Logging out...");
    const db = createClient();
    const result = await logout(db);
    if (result.success) {
      toast.success("Logout successful");
      setTimeout(() => {
        router.push("/");
      }, 500);
    } else {
      toast.error(result.message);
    }
    toast.dismiss();
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center justify-center gap-1">
          <Avatar className="w-12 h-12">
            <AvatarImage className="object-cover" src={profileImage} />
            <AvatarFallback>{fullname.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start justify-start">
            <p className="text-sm whitespace-nowrap">{fullname}</p>
            <p className="text-xs text-muted-foreground font-semibold truncate">
              {email || "N/A"}
            </p>
            <p className="text-xs text-muted-foreground font-semibold truncate">
              {profileType || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button
          onClick={handleLogout}
          className="w-full"
          variant="outline"
          size="icon"
        >
          Logout
          <LogOut />
        </Button>
        <ToggleTheme />
      </div>
    </div>
  );
}
