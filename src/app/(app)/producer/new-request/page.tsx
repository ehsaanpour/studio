
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, PlusCircle } from 'lucide-react';
// We might reuse or adapt GuestReservationForm or create a new ProducerReservationForm
// import { ProducerReservationForm } from '@/components/forms/producer-reservation-form'; 

export default function NewProducerRequestPage() {
  // Mock producer name, in a real app this would come from auth context
  const producerName = "جناب آقای رضایی"; 

  return (
    <div className="space-y-6">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/producer">
          <ArrowRight className="ms-2 h-4 w-4" /> بازگشت به پنل تهیه‌کننده
        </Link>
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center">
            <PlusCircle className="ms-3 h-8 w-8 text-primary" />
            ثبت درخواست رزرو جدید
          </CardTitle>
          <CardDescription>تهیه‌کننده گرامی، {producerName}، لطفاً فرم زیر را برای ثبت درخواست خود تکمیل نمایید.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Placeholder for ProducerReservationForm */}
          <div className="p-8 border border-dashed rounded-lg bg-muted/30 min-h-[400px] flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              فرم رزرو اختصاصی تهیه‌کننده در اینجا قرار خواهد گرفت.
              <br />
              این فرم شامل تاریخ، ساعت، انتخاب استودیو، خدمات استودیو و خدمات جانبی خواهد بود.
              <br />
              اطلاعات شخصی شما (مانند نام) به صورت خودکار در نظر گرفته می‌شود.
            </p>
          </div>
          {/* Example: <ProducerReservationForm /> */}
          <div className="mt-6 flex justify-end">
            <Button disabled type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="ms-2 h-4 w-4"/> ارسال درخواست
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
