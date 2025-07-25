'use client';

import { ProducerEditReservationForm } from '../../../../components/forms/producer-edit-reservation-form';
import { useAuth } from '@/lib/auth-context';
import { getReservationById } from '@/lib/reservation-store';
import type { StudioReservationRequest } from '@/types';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Edit3 } from 'lucide-react';

export default function EditRequestPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [request, setRequest] = useState<StudioReservationRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !user) return;

    const fetchRequest = async () => {
      try {
        const fetchedRequest = await getReservationById(id as string);
        if (!fetchedRequest) {
          setError('درخواست یافت نشد.');
          return;
        }
        if (fetchedRequest.requesterName !== user.name) {
          setError('شما مجاز به ویرایش این درخواست نیستید.');
          return;
        }
        if (fetchedRequest.status === 'confirmed' || fetchedRequest.status === 'cancelled') {
          setError('این درخواست قابل ویرایش نیست.');
          return;
        }
        setRequest(fetchedRequest);
      } catch (err) {
        setError('خطا در دریافت اطلاعات درخواست رزرو.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id, user]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">در حال بارگذاری...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl" dir="rtl">
      <div className="space-y-6">
        <Button variant="outline" asChild className="mb-6 w-full sm:w-auto">
          <Link href="/producer" className="flex items-center justify-center sm:justify-start">
            <ArrowRight className="ms-2 h-4 w-4" />
            <span>بازگشت به پنل تهیه‌کننده</span>
          </Link>
        </Button>
        <Card className="shadow-lg">
          <CardHeader className="space-y-4">
            <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center justify-center sm:justify-start">
              <Edit3 className="ms-3 h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <span>ویرایش درخواست رزرو</span>
            </CardTitle>
            <CardDescription className="text-center sm:text-right text-base sm:text-lg">
              لطفاً تغییرات مورد نظر خود را در فرم زیر اعمال کنید.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {request && <ProducerEditReservationForm request={request} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
