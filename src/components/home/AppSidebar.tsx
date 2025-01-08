import { Home, BookOpen, Group, User2, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import { getCurrentProfile } from "@/db-actions/auth";
import { createClient } from "@/utils/supabase/server";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import SidebarFooterContent from "./SidebarFooterContent";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Papers",
    url: "/papers",
    icon: BookOpen,
  },
  {
    title: "Groups",
    url: "/groups",
    icon: Group,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User2,
  },
];

export async function AppSidebar() {
  let userFullname = "Stranger";
  let userEmail;
  let userProfileType: "STUDENT" | "TEACHER" | "TA" | undefined;
  let userProfileImageUrl;

  const db = createClient();
  const profileQueryResult = await getCurrentProfile(db);
  // console.log("----profileQueryResult from AppSidebar-----", profileQueryResult);
  if (profileQueryResult.success) {
    userFullname = profileQueryResult.data.fullname;
    userEmail = profileQueryResult.data.email;
    userProfileType = profileQueryResult.data.profile_type;
    userProfileImageUrl = profileQueryResult.data.profile_image_url || undefined;
  }
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-center -translate-x-8">
          <Image
            className="object-contain"
            src="/journey.png"
            alt="Thesis Jatra"
            width={150}
            height={150}
          />
          <div className="flex flex-col items-start justify-start -translate-x-4">
            <p className="font-title text-xl whitespace-nowrap">Thesis Jatra</p>

            <p className="text-sm text-muted-foreground font-semibold">
              A Journey towards your revolutioniary idea
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Explore</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarFooterContent
          fullname={userFullname}
          email={userEmail}
          profileType={userProfileType}
          profileImage={userProfileImageUrl}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
