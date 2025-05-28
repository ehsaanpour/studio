"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, CircleUser } from "lucide-react";
import { AppSidebar } from "./app-sidebar"; // Re-use for mobile
import { useSidebar } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const getPageTitle = (pathname: string): string => {
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/forms/new")) return "Create New Form";
  if (pathname.startsWith("/forms")) return "Manage Form"; // Catch-all for edit/preview
  if (pathname.startsWith("/templates")) return "Form Templates";
  return "FormEase";
};


export function AppHeader() {
  const { toggleSidebar, isMobile, openMobile, setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);


  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-card px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
       {isMobile && (
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs p-0">
            {/* Embedding AppSidebar logic directly or simplified version for mobile sheet */}
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                  <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
                    <AppLogo className="h-6 w-6" />
                    <span className="">FormEase</span>
                  </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                 <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setOpenMobile(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                          (pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))) && "bg-muted text-primary"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
          </SheetContent>
        </Sheet>
      )}
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-foreground">{pageTitle}</h1>
      </div>
      <Button variant="outline" size="icon" className="rounded-full">
        <CircleUser className="h-5 w-5" />
        <span className="sr-only">Toggle user menu</span>
      </Button>
    </header>
  );
}

// Duplicating for AppHeader context, as AppSidebar might be too complex to directly embed
// Or ideally refactor navItems to a shared constant.
import Link from "next/link";
import { AppLogo } from "@/components/icons/logo";
import { Home, PlusSquare, Grid } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/forms/new", label: "Create Form", icon: PlusSquare },
  { href: "/templates", label: "Templates", icon: Grid },
];
