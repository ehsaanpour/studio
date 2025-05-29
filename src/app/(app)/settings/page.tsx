
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/dashboard">
          <ArrowRight className="ms-2 h-4 w-4" /> بازگشت به داشبورد
        </Link>
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center">
            <SettingsIcon className="ms-3 h-8 w-8 text-primary" />
            تنظیمات سیستم
          </CardTitle>
          <CardDescription>مدیریت تنظیمات کلی برنامه در این بخش انجام خواهد شد.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 border border-dashed rounded-lg bg-muted/30 min-h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              بخش تنظیمات در حال حاضر در دست ساخت است. <br />
              ویژگی‌های مربوط به تنظیمات برنامه در آینده در اینجا اضافه خواهند شد.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
