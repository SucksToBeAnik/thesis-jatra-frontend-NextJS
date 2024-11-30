import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
import { ToggleTheme } from "./ToggleTheme";

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
    icon: Inbox,
  },
  {
    title: "Groups",
    url: "/groups",
    icon: Calendar,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Search,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: Settings,
  },
];

export function AppSidebar() {
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
      <SidebarFooter className="p-2 shadow-md dark:shadow-gray-300 shadow-gray-600 rounded-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center gap-1">
            <p className="text-xs text-muted-foreground font-semibold p-2 rounded-full bg-gray-200">
              AJ
            </p>
            <div className="flex flex-col items-start justify-start">
              <p className="text-sm whitespace-nowrap">Al Jami Islam Anik</p>
              <p className="text-xs text-muted-foreground font-semibold">
                anik.islam@gmail.com
              </p>
            </div>
          </div>
          <ToggleTheme />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
