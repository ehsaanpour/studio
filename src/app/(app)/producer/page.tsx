
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Film, PlusCircle, ListOrdered, ArrowRight } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import type { StudioReservationRequest } from '@/types';
import { getReservations, subscribe } from '@/lib/reservation-store';
import { format } from 'date-fns-jalali';
import faIR from 'date-fns-jalali/locale/fa-IR';
import { Badge } from '@/components/ui/badge';

// Mock data for producer
const mockProducer = {
  name: 'جناب آقای رضایی', // Example producer name
};

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
    case 'new': return 'جدید';
    case 'read': return 'خوانده شده';
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

  useEffect(() => {
    const fetchAndSetRequests = () => {
      const allRequests = getReservations();
      const filteredRequests = allRequests.filter(req => req.type === 'producer' && req.requesterName === mockProducer.name);
      setMyRequests(filteredRequests);
    };

    fetchAndSetRequests(); // Initial fetch
    const unsubscribe = subscribe(fetchAndSetRequests); // Subscribe to updates

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  return (
    <div className="space-y-6">
       <Button variant="outline" asChild className="mb-6">
        <Link href="/dashboard">
          <ArrowRight className="ms-2 h-4 w-4" /> بازگشت به داشبورد
        </Link>
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold flex items-center">
                <Film className="ms-3 h-8 w-8 text-primary" />
                پنل تهیه‌کننده
              </CardTitle>
              <CardDescription>خوش آمدید، {mockProducer.name}!</CardDescription>
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
          
          <div className="grid md:grid-cols-1 gap-6"> {/* Changed to single column for now to stack sections */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center"><PlusCircle className="ms-2 h-6 w-6 text-accent"/> ایجاد رزرو جدید</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  فرم رزرو برای تهیه‌کنندگان شامل تاریخ، ساعت، انتخاب استودیو، خدمات استودیو و خدمات جانبی خواهد بود.
                  اطلاعات شخصی شما به صورت خودکار در نظر گرفته می‌شود.
                </p>
                <Button className="w-full" asChild>
                  <Link href="/producer/new-request">شروع رزرو جدید</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center"><ListOrdered className="ms-2 h-6 w-6 text-secondary-foreground"/> مشاهده درخواست‌های من</CardTitle>
              </CardHeader>
              <CardContent>
                {myRequests.length === 0 ? (
                  <div className="p-6 border border-dashed rounded-lg bg-muted/30 min-h-[150px] flex items-center justify-center">
                    <p className="text-muted-foreground text-center">
                      شما هنوز هیچ درخواستی ثبت نکرده‌اید.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myRequests.map(request => (
                      <Card key={request.id} className="shadow-sm">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                             <div>
                                <CardTitle className="text-md">
                                  رزرو برای {format(new Date(request.dateTime.reservationDate), 'PPP', { locale: faIR })} از {request.dateTime.startTime} تا {request.dateTime.endTime}
                                </CardTitle>
                                <CardDescription>
                                  استودیو: {getStudioLabel(request.studio)} - ثبت شده در: {format(new Date(request.submittedAt), 'P p', { locale: faIR })}
                                </CardDescription>
                             </div>
                             <Badge variant={getStatusBadgeVariant(request.status)}>
                                {getStatusLabel(request.status)}
                             </Badge>
                          </div>
                        </CardHeader>
                        {/* Optionally, add more details in CardContent if needed */}
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
