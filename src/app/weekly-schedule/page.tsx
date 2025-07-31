"use client";

import { WeeklyScheduleCalendar } from "@/components/weekly-schedule-calendar";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function WeeklySchedulePage() {
  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="mb-4">
        <Button
          variant="ghost"
          asChild
          className="flex items-center gap-2"
        >
          <Link href="/">
            <ArrowRight className="h-4 w-4 rotate-180" />
            بازگشت به صفحه اصلی
          </Link>
        </Button>
      </div>
      <WeeklyScheduleCalendar />
    </div>
  );
}

