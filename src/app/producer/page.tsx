'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Film, PlusCircle, XCircle, Trash2, Edit3 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import type { StudioReservationRequest } from '@/types';
import { getReservations, deleteReservation } from '@/lib/reservation-store';
import { getProgramNames, removeProgramName } from '@/lib/program-name-store';
import { format } from 'date-fns-jalali';
import faIR from 'date-fns-jalali/locale/fa-IR';
import { isPast, isToday, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { AddProgramNameForm } from '@/components/forms/add-program-name-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ProfilePictureUpload } from '@/components/profile/profile-picture-upload';
import { ArrowRight } from 'lucide-react';

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
  const [activeReservationsCount, setActiveReservationsCount] = useState(0);
  const [pastReservationsCount, setPastReservationsCount] = useState(0);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

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
    if (user?.name) {
      fetchAndSetRequests();
      fetchAndSetProgramNames();
    }
  }, [user?.name]);

  useEffect(() => {
    if (myRequests.length > 0) {
      let activeCount = 0;
      let pastCount = 0;
      const now = new Date();

      myRequests.forEach(request => {
        const reservationDate = new Date(request.dateTime.reservationDate); 
        const [hours, minutes] = request.dateTime.endTime.split(':').map(Number);
        
        const reservationEndDateTime = new Date(
          reservationDate.getFullYear(),
          reservationDate.getMonth(),
          reservationDate.getDate(),
          hours,
          minutes
        );

        if (isPast(reservationEndDateTime)) {
          pastCount++;
        } else {
          activeCount++;
        }
      });

      setActiveReservationsCount(activeCount);
      setPastReservationsCount(pastCount);
    } else {
      setActiveReservationsCount(0);
      setPastReservationsCount(0);
    }
  }, [myRequests]);

  const handleRemoveProgramName = async (nameToRemove: string) => {
    try {
      await removeProgramName(nameToRemove);
      toast({
        title: 'نام برنامه حذف شد',
        description: `برنامه "${nameToRemove}" با موفقیت حذف شد.`,
      });
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

  const handleDeleteRequest = async (requestId: string) => {
    try {
      await deleteReservation(requestId);
      setMyRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
      toast({
        title: 'درخواست حذف شد',
        description: 'درخواست رزرو با موفقیت حذف شد.',
      });
    } catch (error) {
      console.error('Error deleting request:', error);
      toast({
        title: 'خطا',
        description: 'خطا در حذف درخواست. لطفاً دوباره تلاش کنید.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAllRequests = async () => {
    try {
      const deletePromises = myRequests.map(request => deleteReservation(request.id));
      await Promise.all(deletePromises);
      setMyRequests([]);
      toast({
        title: 'تمام درخواست‌ها حذف شدند',
        description: 'تمام درخواست‌های رزرو با موفقیت حذف شدند.',
      });
    } catch (error) {
      console.error('Error deleting all requests:', error);
      toast({
        title: 'خطا',
        description: 'خطا در حذف درخواست‌ها. لطفاً دوباره تلاش کنید.',
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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            <Card className="shadow-sm lg:col-span-1 xl:col-span-1">
              <CardHeader>
                <CardTitle className="text-xl">پروفایل کاربری</CardTitle>
                <CardDescription>اطلاعات شخصی و تنظیمات حساب کاربری شما.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
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
                    {isAdmin && (
                      <Button variant="outline" className="justify-start">
                        مدیریت کاربران
                      </Button>
                    )}
                  </div>
                </div>

                {!isAdmin && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">آمار رزروها</h3>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">تعداد رزروهای فعال:</span>
                        <span>{activeReservationsCount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">تعداد رزروهای گذشته:</span>
                        <span>{pastReservationsCount}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm xl:col-span-1">
              <CardHeader>
                <CardTitle className="text-xl">افزودن نام برنامه جدید</CardTitle>
                <CardDescription>نام برنامه‌هایی که قصد دارید در آینده رزرو کنید را اینجا اضافه کنید.</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <AddProgramNameForm />
                <Separator className="my-4" />
                <h4 className="text-md font-semibold mb-2 text-right">برنامه‌های ثبت شده:</h4>
                {programNames.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-right">هنوز هیچ نام برنامه‌ای ثبت نشده است.</p>
                ) : (
                  <ScrollArea className="h-64 lg:h-96 w-full rounded-md border p-4">
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

            <Card className="shadow-sm lg:col-span-1 xl:col-span-1">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>درخواست‌های رزرو من</CardTitle>
                    <CardDescription>لیست تمام درخواست‌های رزرو شما</CardDescription>
                  </div>
                  {myRequests.length > 0 && (
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAllRequests}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      حذف همه درخواست‌ها
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {myRequests.length === 0 ? (
                  <p className="text-center text-muted-foreground">هیچ درخواست رزروی ثبت نشده است.</p>
                ) : (
                  <ScrollArea className="h-[800px]">
                    <div className="space-y-4">
                      {myRequests.map(request => (
                        <Card key={request.id} className="shadow-sm">
                          <CardHeader>
                            <div className="flex justify-between items-start text-right">
                              <div>
                                <CardTitle className="text-lg">
                                  {request.programName} - {getStudioLabel(request.studio)}
                                </CardTitle>
                                <CardDescription>
                                  تاریخ: {format(new Date(request.dateTime.reservationDate), 'EEEE, PPP', { locale: faIR })}
                                  <br />
                                  ساعت: {request.dateTime.startTime} تا {request.dateTime.endTime}
                                </CardDescription>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={getStatusBadgeVariant(request.status)} className="text-sm px-3 py-1 font-semibold">
                                  {getStatusLabel(request.status)}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteRequest(request.id)}
                                  className="text-destructive hover:text-destructive/90"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                {(request.status === 'new' || request.status === 'read') && (
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    asChild
                                  >
                                    <Link href={`/producer/edit-request/${request.id}`}>
                                      <Edit3 className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                )}
                              </div>
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
          <div className="mt-6 flex justify-end">
            <Button asChild>
              <Link href="/weekly-schedule">
                برنامه هفتگی <ArrowRight className="me-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
