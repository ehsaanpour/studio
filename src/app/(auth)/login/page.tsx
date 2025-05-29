import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLogo } from '@/components/icons/logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="flex flex-1 flex-col items-center justify-center">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <Link href="/" className="inline-block mb-4">
              <AppLogo className="h-12 w-12 text-primary mx-auto" />
            </Link>
            <CardTitle className="text-3xl font-bold">ورود به سیستم</CardTitle>
            <CardDescription>برای دسترسی به پنل تهیه‌کننده یا مدیریت وارد شوید.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <LoginForm />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  یا
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/guest">ادامه به عنوان کاربر مهمان</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <footer className="py-4 mt-auto text-center text-xs text-muted-foreground">
        <p>
          تمامی حقوق این نرم افزار برای <Link href="https://ehsaanpour.github.io/Me/index.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">احسان احسانپور</Link> محفوظ است
        </p>
      </footer>
    </div>
  );
}
