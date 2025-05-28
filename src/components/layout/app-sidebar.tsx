"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/icons/logo";
import { Home, PlusSquare, Grid, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar"; // Import useSidebar
import { cn } from "@/lib/utils";


const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/forms/new", label: "Create Form", icon: PlusSquare },
  { href: "/templates", label: "Templates", icon: Grid },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { open, toggleSidebar, isMobile, state } = useSidebar();

  return (
    <Sidebar side="left" variant="sidebar" collapsible={isMobile ? "offcanvas" : "icon"}>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className={cn(
            "flex items-center gap-2 transition-all duration-300",
            state === "collapsed" && !isMobile ? "justify-center" : ""
          )}>
          <AppLogo className="h-8 w-8 text-primary" />
          <span className={cn(
              "text-2xl font-bold text-sidebar-foreground whitespace-nowrap",
              state === "collapsed" && !isMobile ? "sr-only opacity-0" : "opacity-100"
            )}>
            FormEase
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                  tooltip={item.label}
                  className="justify-start"
                >
                  <item.icon className="h-5 w-5" />
                  <span className={cn(state === "collapsed" && !isMobile ? "sr-only" : "")}>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <SidebarMenu>
           <SidebarMenuItem>
            <SidebarMenuButton className="justify-start" tooltip="Settings">
              <Settings className="h-5 w-5" />
              <span className={cn(state === "collapsed" && !isMobile ? "sr-only" : "")}>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton className="justify-start" tooltip="Log out">
              <LogOut className="h-5 w-5" />
              <span className={cn(state === "collapsed" && !isMobile ? "sr-only" : "")}>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {!isMobile && (
           <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mt-4 self-center text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            {open ? <ChevronLeft /> : <ChevronRight />}
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
