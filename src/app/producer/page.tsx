'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Film, PlusCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import type { StudioReservationRequest } from '@/types';
import { getReservations, subscribe } from '@/lib/reservation-store';
import { format } from 'date-fns-jalali';
import faIR from 'date-fns-jalali/locale/fa-IR';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';

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
  const { user } = useAuth();

  useEffect(() => {
    let isSubscribed = true;

    const fetchAndSetRequests = async () => {
      try {
        const allRequests = await getReservations();
        if (isSubscribed) {
          const filteredRequests = allRequests.filter(req => 
            req.type === 'producer' && req.requesterName === user?.name
          );
          setMyRequests(filteredRequests);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchAndSetRequests(); // Initial fetch
    const unsubscribe = subscribe(() => {
      if (isSubscribed) {
        fetchAndSetRequests();
      }
    });

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, [user?.name]);

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
          
          {myRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">شما هنوز هیچ درخواستی ثبت نکرده‌اید.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map(request => (
                <Card key={request.id} className="shadow-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {getStudioLabel(request.studio)}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
} 