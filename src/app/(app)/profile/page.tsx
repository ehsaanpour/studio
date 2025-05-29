
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UserCircle, ArrowRight } from 'lucide-react';

export default function ProfilePage() {
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
            <UserCircle className="ms-3 h-8 w-8 text-primary" />
            پروفایل کاربر
          </CardTitle>
          <CardDescription>اطلاعات و تنظیمات حساب کاربری شما.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 border border-dashed rounded-lg bg-muted/30 min-h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              محتوای صفحه پروفایل در اینجا قرار خواهد گرفت.
              <br />
              (مانند امکان تغییر نام، ایمیل و مشاهده تاریخچه فعالیت)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
