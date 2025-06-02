'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Film, PlusCircle, XCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import type { StudioReservationRequest } from '@/types';
import { getReservations } from '@/lib/reservation-store'; // Removed subscribe
import { getProgramNames, removeProgramName } from '@/lib/program-name-store'; // Removed subscribeToProgramNames
import { format } from 'date-fns-jalali';
import faIR from 'date-fns-jalali/locale/fa-IR';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { AddProgramNameForm } from '@/components/forms/add-program-name-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast'; // Import useToast
import { ProfilePictureUpload } from '@/components/profile/profile-picture-upload'; // Import ProfilePictureUpload
import { ArrowRight } from 'lucide-react'; // Import ArrowRight for navigation buttons
import { WeeklyScheduleCalendar } from '@/components/weekly-schedule-calendar'; // Import WeeklyScheduleCalendar

// Helper function to get studio label (can be moved to a shared util later)
const getStudioLabel = (studioId: StudioReservationRequest['studio']) => {
  switch (studioId) {
    case 'studio2': return 'استودیو ۲ (فرانسه)';
    case 'studio5': return 'استودیو ۵ (-۳)';
    case 'studio6': return 'استودیو ۶ (مایا ناصر)';
    default: return 'نامشخص';
  }
};

const getStatusLabel = (status: StudioReservationRequest['status']): string => {
  switch (status) {
    case 'new': return 'در انتظار بررسی';
    case 'read': return 'در حال بررسی';
    case 'confirmed': return 'تایید شده';
    case 'cancelled': return 'لغو شده';
    default: return status;
  }
};

const getStatusBadgeVariant = (status: StudioReservationRequest['status']): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'new': return 'destructive';
    case 'read': return 'secondary';
    case 'confirmed': return 'default';
    case 'cancelled': return 'outline';
    default: return 'secondary';
  }
};

export default function ProducerPanelPage() {
  const [myRequests, setMyRequests] = useState<StudioReservationRequest[]>([]);
  const [programNames, setProgramNames] = useState<string[]>([]);
  const { user, isAdmin } = useAuth(); // Get isAdmin from useAuth
  const { toast } = useToast(); // Initialize useToast

  const fetchAndSetRequests = async () => {
    try {
      const allRequests = await getReservations();
      const filteredRequests = allRequests.filter(req => 
        req.type === 'producer' && req.requesterName === user?.name
      );
      setMyRequests(filteredRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const fetchAndSetProgramNames = async () => {
    try {
      const names = await getProgramNames();
      setProgramNames(names);
    } catch (error) {
      console.error('Error fetching program names:', error);
    }
  };

  useEffect(() => {
    fetchAndSetRequests(); // Initial fetch for requests
    fetchAndSetProgramNames(); // Initial fetch for program names
  }, [user?.name]); // Depend on user.name to re-fetch if user changes

  const handleRemoveProgramName = async (nameToRemove: string) => {
    try {
      await removeProgramName(nameToRemove);
      toast({
        title: 'نام برنامه حذف شد',
        description: `برنامه "${nameToRemove}" با موفقیت حذف شد.`,
      });
      // Re-fetch program names after successful removal
      await fetchAndSetProgramNames();
    } catch (error) {
      console.error('Error removing program name:', error);
      toast({
        title: 'خطا در حذف',
        description: `خطا در حذف برنامه "${nameToRemove}".`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold flex items-center">
                <Film className="ms-3 h-8 w-8 text-primary" />
                پنل تهیه‌کننده
              </CardTitle>
              <CardDescription>خوش آمدید، {user?.name}!</CardDescription>
            </div>
            <Button asChild>
              <Link href="/producer/new-request">
                <PlusCircle className="ms-2 h-5 w-5" /> ثبت درخواست جدید
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-muted-foreground">
            از این پنل می‌توانید درخواست‌های رزرو جدید ثبت کرده و درخواست‌های قبلی خود را مشاهده و مدیریت نمایید.
          </p>
          
          <div className="grid lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {/* Profile Section (New) */}
            <Card className="shadow-sm lg:col-span-1 xl:col-span-1">
              <CardHeader>
                <CardTitle className="text-xl">پروفایل کاربری</CardTitle>
                <CardDescription>اطلاعات شخصی و تنظیمات حساب کاربری شما.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ProfilePictureUpload />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">اطلاعات شخصی</h3>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">نام:</span>
                      <span>{user?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">نام کاربری:</span>
                      <span>{user?.username}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">ایمیل:</span>
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">شماره تماس:</span>
                      <span>{user?.phone}</span>
                    </div>
                    {user?.workplace && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">محل کار:</span>
                        <span>{user.workplace}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">تنظیمات حساب کاربری</h3>
                  <div className="grid gap-4">
                    <Button variant="outline" asChild className="justify-start">
                      <Link href="/profile/change-password">
                        تغییر رمز عبور
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="justify-start">
                      <Link href="/profile/edit-profile">
                        ویرایش اطلاعات شخصی
                      </Link>
                    </Button>
                    {/* Admin-specific button, not shown for producers */}
                    {isAdmin && (
                      <Button variant="outline" className="justify-start">
                        مدیریت کاربران
                      </Button>
                    )}
                  </div>
                </div>

                {/* Reservation Stats (only for producers, as per original profile page) */}
                {!isAdmin && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">آمار رزروها</h3>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">تعداد رزروهای فعال:</span>
                        <span>0</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">تعداد رزروهای گذشته:</span>
                        <span>0</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add Program Name Section */}
            <Card className="shadow-sm xl:col-span-1">
              <CardHeader>
                <CardTitle className="text-xl">افزودن نام برنامه جدید</CardTitle>
                <CardDescription>نام برنامه‌هایی که قصد دارید در آینده رزرو کنید را اینجا اضافه کنید.</CardDescription>
              </CardHeader>
              <CardContent>
                <AddProgramNameForm />
                <Separator className="my-4" />
                <h4 className="text-md font-semibold mb-2 text-right">برنامه‌های ثبت شده:</h4>
                {programNames.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-right">هنوز هیچ نام برنامه‌ای ثبت نشده است.</p>
                ) : (
                  <ScrollArea className="h-32 w-full rounded-md border p-4">
                    <ul className="space-y-1" dir="rtl">
                      {programNames.map((name, index) => (
                        <li key={index} className="flex items-center justify-between text-sm">
                          <span className="flex-grow text-right">{name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveProgramName(name)}
                            className="ms-2"
                          >
                            <XCircle className="h-4 w-4 text-red-500" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>

            {/* My Requests Section */}
            <Card className="shadow-sm lg:col-span-1 xl:col-span-1">
              <CardHeader>
                <CardTitle className="text-xl text-right">درخواست‌های رزرو من</CardTitle>
                <CardDescription className="text-right">لیست درخواست‌های رزرو استودیو شما.</CardDescription>
              </CardHeader>
              <CardContent>
                {myRequests.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground text-right">شما هنوز هیچ درخواستی ثبت نکرده‌اید.</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[300px] w-full pr-4">
                    <div className="space-y-4" dir="rtl">
                      {myRequests.map(request => (
                        <Card key={request.id} className="shadow-sm">
                          <CardHeader>
                            <div className="flex justify-between items-start text-right">
                              <div>
                                <CardTitle className="text-lg">
                                  {request.programName} - {getStudioLabel(request.studio)}
                                </CardTitle>
                                <CardDescription>
                                  تاریخ: {format(new Date(request.dateTime.reservationDate), 'PPP', { locale: faIR })}
                                  <br />
                                  ساعت: {request.dateTime.startTime} تا {request.dateTime.endTime}
                                </CardDescription>
                              </div>
                              <Badge variant={getStatusBadgeVariant(request.status)} className="text-sm px-3 py-1 font-semibold">
                                {getStatusLabel(request.status)}
                              </Badge>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
          {/* Weekly Schedule Calendar Section */}
          <div className="mt-6">
            <WeeklyScheduleCalendar />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
