'use client';

import type React from 'react';
import { AppHeader } from '@/components/layout/app-header';

export default function ProducerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background overflow-auto">
        {children}
      </main>
      <footer className="py-4 text-center text-xs text-muted-foreground border-t border-border bg-background">
        <p>
          تمامی حقوق این نرم افزار برای <a href="https://ehsaanpour.github.io/Me/index.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">احسان احسانپور</a> محفوظ است
        </p>
      </footer>
    </div>
  );
} 