
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UserCircle, ArrowRight, Edit3, History, Settings2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

// Mock user data - in a real app, this would come from an auth context or API
const mockUser = {
  name: 'کاربر ادمین', // Admin User
  username: 'admin',
  role: 'مدیر سیستم', // System Administrator
  email: 'admin@example.com',
  avatarUrl: 'https://placehold.co/100x100.png', // Placeholder avatar
};

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <Button variant="outline" asChild className="mb-6 print:hidden">
        <Link href="/dashboard">
          <ArrowRight className="ms-2 h-4 w-4" /> بازگشت به داشبورد
        </Link>
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Avatar className="h-20 w-20">
              <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} data-ai-hint="placeholder user" />
              <AvatarFallback>{mockUser.name.substring(0, 1)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl font-bold flex items-center">
                {mockUser.name} <UserCircle className="me-3 h-8 w-8 text-primary" />
              </CardTitle>
              <CardDescription className="text-md">
                {mockUser.role} - @{mockUser.username}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* User Details Section */}
          <section>
            <h3 className="text-xl font-semibold mb-3 text-foreground">اطلاعات کاربری</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>نام کامل:</strong> {mockUser.name}</p>
              <p><strong>نام کاربری:</strong> {mockUser.username}</p>
              <p><strong>ایمیل:</strong> {mockUser.email}</p>
              <p><strong>نقش:</strong> {mockUser.role}</p>
            </div>
            <Button variant="outline" size="sm" className="mt-4" disabled>
              ویرایش اطلاعات <Edit3 className="me-2 h-4 w-4" />
            </Button>
          </section>

          <Separator />

          {/* Activity History Section */}
          <section>
            <h3 className="text-xl font-semibold mb-3 text-foreground flex items-center">
              <History className="ms-2 h-5 w-5 text-primary" /> تاریخچه فعالیت
            </h3>
            <div className="p-6 border border-dashed rounded-lg bg-muted/30 min-h-[100px] flex items-center justify-center">
              <p className="text-muted-foreground text-center">
                تاریخچه فعالیت‌های اخیر شما در اینجا نمایش داده خواهد شد. (مثلاً ورودها، تغییرات مهم و غیره)
              </p>
            </div>
          </section>

          <Separator />

          {/* Account Settings Section */}
          <section>
            <h3 className="text-xl font-semibold mb-3 text-foreground flex items-center">
              <Settings2 className="ms-2 h-5 w-5 text-primary" /> تنظیمات حساب
            </h3>
            <div className="space-y-3">
              <Button variant="secondary" className="w-full sm:w-auto" asChild>
                <Link href="/settings">تغییر رمز عبور و مدیریت ادمین‌ها</Link>
              </Button>
              {/* Add more settings links/buttons as needed */}
              <p className="text-xs text-muted-foreground">
                برای تنظیمات مربوط به اطلاع‌رسانی‌ها، زبان و سایر موارد به این بخش مراجعه کنید (در آینده).
              </p>
            </div>
          </section>
        </CardContent>
        <CardFooter>
           <p className="text-xs text-muted-foreground">
            این صفحه پروفایل شماست. اطلاعات نمایش داده شده در اینجا (به جز نام و نقش) قابلیت ویرایش در آینده را خواهند داشت.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

    