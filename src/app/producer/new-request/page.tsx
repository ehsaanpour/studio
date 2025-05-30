'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, PlusCircle } from 'lucide-react';
import { ProducerReservationForm } from '@/components/forms/producer-reservation-form';
import React from 'react';
import { useAuth } from '@/lib/auth-context';

export default function NewProducerRequestPage() {
  const { user } = useAuth();

  // Use the actual producer name from auth context
  const producerName = user?.name || "تهیه‌کننده";

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
          <ProducerReservationForm producerName={producerName} />
        </CardContent>
      </Card>
    </div>
  );
} 