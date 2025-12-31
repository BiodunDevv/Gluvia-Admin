"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  IconDashboard,
  IconApple,
  IconRuler,
  IconUser,
  IconUsers,
  IconClipboardList,
  IconSettings,
} from "@tabler/icons-react";

const pageConfig: Record<
  string,
  { title: string; description?: string; icon: React.ElementType }
> = {
  "/dashboard": {
    title: "Dashboard",
    description: "Overview and analytics",
    icon: IconDashboard,
  },
  "/dashboard/foods": {
    title: "Foods Database",
    description: "Manage food items and nutrition data",
    icon: IconApple,
  },
  "/dashboard/rules": {
    title: "Rule Templates",
    description: "Diabetes management rules",
    icon: IconRuler,
  },
  "/dashboard/users": {
    title: "User Management",
    description: "Manage app users",
    icon: IconUser,
  },
  "/dashboard/admins": {
    title: "Admin Management",
    description: "Manage administrators",
    icon: IconUsers,
  },
  "/dashboard/audit": {
    title: "Audit Logs",
    description: "System activity history",
    icon: IconClipboardList,
  },
  "/dashboard/settings": {
    title: "Settings",
    description: "System configuration",
    icon: IconSettings,
  },
};

export function SiteHeader() {
  const pathname = usePathname();

  // Find the matching page config
  const currentPage = pageConfig[pathname] || {
    title: "Dashboard",
    description: "Gluvia Admin Panel",
    icon: IconDashboard,
  };

  const Icon = currentPage.icon;

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-muted-foreground" />
          <div className="flex flex-col">
            <h1 className="text-base font-medium leading-tight">
              {currentPage.title}
            </h1>
            {currentPage.description && (
              <p className="text-xs text-muted-foreground hidden sm:block">
                {currentPage.description}
              </p>
            )}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/BiodunDevv/Gluvia-Admin"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
