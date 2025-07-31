'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Edit3 } from 'lucide-react';
import { ProducerReservationForm } from '@/components/forms/producer-reservation-form';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getReservationById } from '@/lib/reservation-store';
import { StudioReservationRequest } from '@/types';
import { useParams } from 'next/navigation';

export default function EditProducerRequestPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const [reservation, setReservation] = useState<StudioReservationRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getReservationById(id as string).then(data => {
        setReservation(data);
        setIsLoading(false);
      });
    }
  }, [id]);

  const producerName = user?.name || "تهیه‌کننده";

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl" dir="rtl">
      <div className="space-y-6">
        <Button variant="outline" asChild className="mb-6 w-full sm:w-auto">
          <Link href="/admin" className="flex items-center justify-center sm:justify-start">
            <ArrowRight className="ms-2 h-4 w-4" />
            <span>بازگشت به پنل مدیریت</span>
          </Link>
        </Button>
        <Card className="shadow-lg">
          <CardHeader className="space-y-4">
            <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center justify-center sm:justify-start">
              <Edit3 className="ms-3 h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <span>ویرایش درخواست رزرو</span>
            </CardTitle>
            <CardDescription className="text-center sm:text-right text-base sm:text-lg">
              شما در حال ویرایش درخواست ثبت شده توسط {reservation?.requesterName || 'کاربر'} هستید.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>در حال بارگذاری اطلاعات...</p>
            ) : reservation ? (
              <ProducerReservationForm producerName={producerName} existingReservation={reservation} />
            ) : (
              <p>درخواست مورد نظر یافت نشد.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

