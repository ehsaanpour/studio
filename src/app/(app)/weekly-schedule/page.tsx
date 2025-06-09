"use client";

import { WeeklyScheduleCalendar } from "@/components/weekly-schedule-calendar";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function WeeklySchedulePage() {
  const router = useRouter();

  const handleBack = () => {
    // Check if user is admin (you might want to replace this with your actual role check)
    const isAdmin = localStorage.getItem("userRole") === "admin";
    router.push(isAdmin ? "/admin" : "/producer");
  };

  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          بازگشت
        </Button>
      </div>
      <WeeklyScheduleCalendar />
    </div>
  );
}
