"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IconDashboard,
  IconSettings,
  IconApple,
  IconRuler,
  IconClipboardList,
  IconUsers,
  IconUser,
} from "@tabler/icons-react";
import { useAuthStore } from "@/stores/useAuthStore";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavSecondary } from "../SideBar/nav-secondary";
import { NavDocuments } from "../SideBar/nav-documents";
import { NavMain } from "../SideBar/nav-main";
import { NavUser } from "../SideBar/nav-user";

const navigationData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Foods Database",
      url: "/dashboard/foods",
      icon: IconApple,
    },
    {
      title: "Rule Templates",
      url: "/dashboard/rules",
      icon: IconRuler,
    },
    {
      title: "User Management",
      url: "/dashboard/users",
      icon: IconUser,
    },
    {
      title: "Admin Management",
      url: "/dashboard/admins",
      icon: IconUsers,
    },
    {
      title: "Audit Logs",
      url: "/dashboard/audit",
      icon: IconClipboardList,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
  ],
  // documents: [
  //   {
  //     name: "Documentation",
  //     url: "/docs",
  //     icon: IconFileText,
  //   },
  //   {
  //     name: "API Reference",
  //     url: "/api-docs",
  //     icon: IconDatabase,
  //   },
  //   {
  //     name: "Integration Guide",
  //     url: "/integration",
  //     icon: IconListDetails,
  //   },
  // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, getMe, token, logout } = useAuthStore();

  React.useEffect(() => {
    // Fetch user data if we have a token but no user data
    if (token && !user) {
      getMe();
    }
  }, [token, user, getMe]);

  const handleLogout = async () => {
    await logout();
  };

  const userData = {
    name: user?.name || "Admin User",
    email: user?.email || "admin@gluvia.com",
    avatar: "/avatars/admin.jpg",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <Image
                  src="/branding/logo.png"
                  alt="Gluvia logo"
                  width={24}
                  height={24}
                  className="rounded-sm object-contain"
                />
                <span className="text-base font-semibold">Gluvia AI</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationData.navMain} />
        {/* <NavDocuments items={navigationData.documents} /> */}
        <NavSecondary items={navigationData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} onLogout={handleLogout} />
      </SidebarFooter>
    </Sidebar>
  );
}
