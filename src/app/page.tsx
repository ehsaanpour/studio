
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Film, CalendarCheck, UserCog } from 'lucide-react';
import { AppLogo } from '@/components/icons/logo';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
            <AppLogo className="h-8 w-8" />
            <span>رزرو استودیو</span>
          </Link>
          <Button asChild variant="ghost">
            <Link href="/login">ورود به سیستم</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-right">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
                  استودیوی خود را به راحتی رزرو کنید
                </h1>
                <p className="mt-6 max-w-2xl mx-auto md:mx-0 md:ms-auto text-lg sm:text-xl text-muted-foreground">
                  به سادگی استودیوهای مجهز ما را برای پروژه‌های فیلمبرداری و صدابرداری خود انتخاب و رزرو نمایید. دسترسی سریع برای مهمانان و تهیه‌کنندگان.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row justify-center md:justify-end gap-4">
                  <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/guest">
                      رزرو به عنوان مهمان <ArrowLeft className="ms-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/login">
                      ورود تهیه‌کننده / مدیر <ArrowLeft className="ms-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="mt-10 md:mt-0 flex justify-center md:justify-start">
                <Image
                  src="https://placehold.co/600x400.png"
                  alt="تصویر نمایشی استودیو فیلمبرداری"
                  width={600}
                  height={400}
                  className="rounded-xl shadow-2xl"
                  data-ai-hint="control room"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">ویژگی‌های کلیدی سیستم</h2>
              <p className="mt-4 text-lg text-muted-foreground">طراحی شده برای سهولت در رزرو و مدیریت استودیو.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-card rounded-xl shadow-lg flex flex-col items-center text-center">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <CalendarCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">رزرو آسان برای مهمانان</h3>
                <p className="text-muted-foreground">کاربران مهمان می‌توانند بدون نیاز به ثبت‌نام، درخواست رزرو خود را ثبت کنند.</p>
              </div>
              <div className="p-6 bg-card rounded-xl shadow-lg flex flex-col items-center text-center">
                <div className="p-3 bg-accent/10 rounded-full mb-4">
                 <Film className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">پنل اختصاصی تهیه‌کنندگان</h3>
                <p className="text-muted-foreground">تهیه‌کنندگان با ورود به پنل خود، به سرعت و با اطلاعات از پیش ‌تکمیل‌شده رزرو انجام می‌دهند.</p>
              </div>
              <div className="p-6 bg-card rounded-xl shadow-lg flex flex-col items-center text-center">
                <div className="p-3 bg-secondary/20 rounded-full mb-4">
                  <UserCog className="h-8 w-8 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">مدیریت جامع برای ادمین</h3>
                <p className="text-muted-foreground">ادمین‌ها به تمامی درخواست‌ها دسترسی داشته و می‌توانند تهیه‌کنندگان جدید را اضافه کنند.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-muted border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>
            تمامی حقوق این نرم افزار برای <a href="https://ehsaanpour.github.io/Me/index.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">احسان احسانپور</a> محفوظ است
          </p>
        </div>
      </footer>
    </div>
  );
}
