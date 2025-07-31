"use client";

import React, { useState, useEffect } from 'react';
import {
  format as formatDateFnsJalali,
  addWeeks,
  subWeeks,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  parseISO,
} from 'date-fns-jalali';
import faIR from 'date-fns-jalali/locale/fa-IR';
import { ChevronLeft, ChevronRight, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Define studio colors
const STUDIO_COLORS: { [key: string]: string } = {
  "استودیو ۲ (فرانسه)": "bg-blue-500 text-white",
  "استودیو ۵ (-۳)": "bg-green-500 text-white",
  "استودیو ۶ (مایا ناصر)": "bg-purple-500 text-white",
};

// Helper to map backend studio names to display names and colors
const getStudioDisplayName = (studioName: string): string => {
  if (studioName.toLowerCase().includes("studio2")) return "استودیو ۲ (فرانسه)";
  if (studioName.toLowerCase().includes("studio5")) return "استودیو ۵ (-۳)";
  if (studioName.toLowerCase().includes("studio6")) return "استودیو ۶ (مایا ناصر)";
  // Default to a known studio or a generic name if no match
  return "نامشخص"; 
};

interface Reservation {
  id: string;
  programName: string;
  dateTime: {
    reservationDate: string; // ISO string
    startTime: string;
    endTime: string;
  };
  studio: string;
  status: string;
  repetition?: {
    type: string;
  };
  engineers?: string[];
}

interface Engineer {
  id: string;
  name: string;
}

interface Program {
  id: string;
  name: string;
  time: string;
  studio: string; // Display name
  date: Date;
  engineers: string[];
  isRecurring: boolean;
}

const WEEK_DAYS_PERSIAN_FULL = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

export function WeeklyScheduleCalendar() {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { locale: faIR, weekStartsOn: 6 }));
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      setError(null);
      try {
        const [reservationsResponse, engineersResponse] = await Promise.all([
          fetch('/api/reservations'),
          fetch('/api/engineer/list'), // Assuming this endpoint exists
        ]);

        if (!reservationsResponse.ok) {
          throw new Error(`HTTP error! status: ${reservationsResponse.status}`);
        }
        if (!engineersResponse.ok) {
          throw new Error(`HTTP error! status: ${engineersResponse.status}`);
        }

        const reservations: Reservation[] = await reservationsResponse.json();
        const engineers: Engineer[] = await engineersResponse.json();
        
        const engineerMap = engineers.reduce((acc, engineer) => {
          acc[engineer.id] = engineer.name;
          return acc;
        }, {} as Record<string, string>);

        const fetchedPrograms: Program[] = reservations
          .filter((res) => res.status === 'confirmed')
          .map((res) => {
            const d = parseISO(res.dateTime.reservationDate);
            // HACK: Correct for timezone issue where stored UTC date is a day behind.
            const correctedDate = new Date(d.setDate(d.getDate() + 1));
            return {
              id: res.id,
              name: res.programName,
              time: `${res.dateTime.startTime} - ${res.dateTime.endTime}`,
              studio: getStudioDisplayName(res.studio),
              date: correctedDate,
              engineers: res.engineers?.map(id => engineerMap[id]).filter(Boolean) || [],
              isRecurring: res.repetition?.type === 'weekly_1month' || res.repetition?.type === 'weekly_3months',
            }
          });

        setPrograms(fetchedPrograms);
      } catch (e: any) {
        setError(e.message);
        console.error("Failed to fetch programs:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []); // Empty dependency array means this runs once on mount

  const handlePrevWeek = () => {
    setCurrentWeekStart((prev) => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => addWeeks(prev, 1));
  };

  const weekEnd = endOfWeek(currentWeekStart, { locale: faIR, weekStartsOn: 6 });
  const daysInWeek = eachDayOfInterval({ start: currentWeekStart, end: weekEnd });

  const programsByDay: { [key: string]: Program[] } = {};
  daysInWeek.forEach(day => {
    const dayKey = formatDateFnsJalali(day, 'yyyy-MM-dd', { locale: faIR });
    programsByDay[dayKey] = programs.filter(program => isSameDay(program.date, day));
  });

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">
          برنامه هفتگی
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevWeek} aria-label="هفته قبل">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {formatDateFnsJalali(currentWeekStart, 'd LLLL', { locale: faIR })} - {formatDateFnsJalali(weekEnd, 'd LLLL yyyy', { locale: faIR })}
          </span>
          <Button variant="outline" size="icon" onClick={handleNextWeek} aria-label="هفته بعد">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">
            خطا در بارگذاری برنامه‌ها: {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  {WEEK_DAYS_PERSIAN_FULL.map((dayName, index) => (
                    <th key={dayName} className="p-2 border text-center">
                      {dayName} <br />
                      <span className="text-xs font-normal">
                        {formatDateFnsJalali(daysInWeek[index], 'd LLLL', { locale: faIR })}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {daysInWeek.map((day) => {
                    const dayKey = formatDateFnsJalali(day, 'yyyy-MM-dd', { locale: faIR });
                    const programsForThisDay = programsByDay[dayKey] || [];
                    return (
                      <td key={dayKey} className="p-2 border align-top min-w-[150px]">
                        {programsForThisDay.length > 0 ? (
                          <div className="space-y-2">
                            {programsForThisDay.map(program => (
                              <div key={program.id} className={cn("p-2 rounded-md text-xs", STUDIO_COLORS[program.studio])}>
                                <div className="font-semibold flex items-center">
                                  {program.name}
                                  {program.isRecurring && (
                                    <Repeat className="mr-2 h-4 w-4 text-white" />
                                  )}
                                </div>
                                <div>{program.time}</div>
                                <div>{program.studio}</div>
                                {program.engineers.length > 0 && (
                                  <div className="pt-1 mt-1 border-t border-white/50">
                                    {program.engineers.join(', ')}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-xs">برنامه‌ای نیست</p>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

