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
import { Home, PlusSquare, Grid, Settings, LogOut, ChevronRight, ChevronLeft } from "lucide-react"; // Chevron directions adjusted for RTL context
import { useSidebar } from "@/components/ui/sidebar"; 
import { cn } from "@/lib/utils";


const navItems = [
  { href: "/dashboard", label: "داشبورد", icon: Home },
  { href: "/forms/new", label: "ایجاد فرم", icon: PlusSquare },
  { href: "/templates", label: "قالب‌ها", icon: Grid },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { open, toggleSidebar, isMobile, state } = useSidebar();

  // For RTL, sidebar is on the right. ChevronRight collapses, ChevronLeft expands.
  const CollapseIcon = ChevronRight;
  const ExpandIcon = ChevronLeft;

  return (
    <Sidebar side="right" variant="sidebar" collapsible={isMobile ? "offcanvas" : "icon"}> {/* Changed side to right */}
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
            فرم‌ایزی
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
            <SidebarMenuButton className="justify-start" tooltip="تنظیمات">
              <Settings className="h-5 w-5" />
              <span className={cn(state === "collapsed" && !isMobile ? "sr-only" : "")}>تنظیمات</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton className="justify-start" tooltip="خروج">
              <LogOut className="h-5 w-5" />
              <span className={cn(state === "collapsed" && !isMobile ? "sr-only" : "")}>خروج</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {!isMobile && (
           <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mt-4 self-center text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            {open ? <CollapseIcon /> : <ExpandIcon />}
            <span className="sr-only">باز/بسته کردن نوار کناری</span>
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
