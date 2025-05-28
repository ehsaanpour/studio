"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, CircleUser } from "lucide-react";
// AppSidebar is not directly used here for mobile sheet content to simplify, navItems are duplicated.
import { useSidebar } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AppLogo } from "@/components/icons/logo";
import { Home, PlusSquare, Grid } from "lucide-react";


const getPageTitle = (pathname: string): string => {
  if (pathname.startsWith("/dashboard")) return "داشبورد";
  if (pathname.startsWith("/forms/new")) return "ایجاد فرم جدید";
  if (pathname.startsWith("/forms")) return "مدیریت فرم"; 
  if (pathname.startsWith("/templates")) return "قالب‌های فرم";
  return "فرم‌ایزی";
};

// Duplicating navItems for AppHeader's mobile sheet context
const navItems = [
  { href: "/dashboard", label: "داشبورد", icon: Home },
  { href: "/forms/new", label: "ایجاد فرم", icon: PlusSquare },
  { href: "/templates", label: "قالب‌ها", icon: Grid },
];


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
              <span className="sr-only">باز/بسته کردن منو</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="sm:max-w-xs p-0"> {/* Changed side to right for RTL */}
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                  <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
                    <AppLogo className="h-6 w-6" />
                    <span className="">فرم‌ایزی</span>
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
        <span className="sr-only">باز/بسته کردن منوی کاربر</span>
      </Button>
    </header>
  );
}
