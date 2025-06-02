"use client";

import { WeeklyScheduleCalendar } from "@/components/weekly-schedule-calendar";

export default function WeeklySchedulePage() {
  return (
    <div className="flex-1 p-4 md:p-6">
      <WeeklyScheduleCalendar />
    </div>
  );
}
