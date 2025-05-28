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
import { LayoutDashboard, UserPlus, LogIn, ShieldCheck, Settings, LogOut, ChevronRight, ChevronLeft, Home } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar"; 
import { cn } from "@/lib/utils";

// Updated navItems for Studio Reservation System
const navItems = [
  { href: "/dashboard", label: "داشبورد", icon: LayoutDashboard }, // This can be the main entry after login
  { href: "/guest", label: "رزرو مهمان", icon: UserPlus }, // Or keep this accessible if needed
  { href: "/producer", label: "پنل تهیه‌کننده", icon: LogIn }, // Link to producer panel
  { href: "/admin", label: "پنل مدیریت", icon: ShieldCheck }, // Link to admin panel
];

export function AppSidebar() {
  const pathname = usePathname();
  const { open, toggleSidebar, isMobile, state } = useSidebar();

  const CollapseIcon = ChevronRight;
  const ExpandIcon = ChevronLeft;

  // Hide sidebar for login and guest pages if they are standalone full-page experiences
  if (pathname === "/login" || pathname === "/guest") {
    return null;
  }

  return (
    <Sidebar side="right" variant="sidebar" collapsible={isMobile ? "offcanvas" : "icon"}>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className={cn(
            "flex items-center gap-2 transition-all duration-300",
            state === "collapsed" && !isMobile ? "justify-center" : ""
          )}>
          <Link href="/" className="flex items-center gap-2">
            <AppLogo className="h-8 w-8 text-primary" />
            <span className={cn(
                "text-2xl font-bold text-sidebar-foreground whitespace-nowrap",
                state === "collapsed" && !isMobile ? "sr-only opacity-0" : "opacity-100"
              )}>
              رزرو استودیو
            </span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
           <SidebarMenuItem>
              <Link href="/" legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === "/"}
                  tooltip="صفحه اصلی"
                  className="justify-start"
                >
                  <Home className="h-5 w-5" />
                  <span className={cn(state === "collapsed" && !isMobile ? "sr-only" : "")}>صفحه اصلی</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href) && (item.href === "/" || item.href === "/dashboard" ? pathname === item.href : true) }
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
