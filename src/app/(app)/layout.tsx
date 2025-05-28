'use client';

import type React from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation'; // To conditionally render layout

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout is for authenticated areas like /dashboard, /producer, /admin
  // Login and Guest pages will use their own simpler layout or no shared layout.
  // We can refine this logic if specific pages need to opt-out.
  // For now, AppHeader and AppSidebar will hide themselves on /login and /guest.

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
