import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bot, Edit3, LayoutGrid } from 'lucide-react'; // Changed ArrowRight to ArrowLeft
import { AppLogo } from '@/components/icons/logo';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
            <AppLogo className="h-8 w-8" />
            <span>فرم‌ایزی</span>
          </Link>
          <Button asChild variant="ghost">
            <Link href="/dashboard">ورود به برنامه</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
              فرم‌های هوشمندتر، بدون دردسر بسازید
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground">
              فرم‌ایزی از هوش مصنوعی برای کمک به شما در ایجاد فرم‌های بهینه با پیشنهادات هوشمند برای انواع سوالات و قوانین اعتبارسنجی استفاده می‌کند. جمع‌آوری داده‌های خود را همین امروز ساده کنید.
            </p>
            <div className="mt-10">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/dashboard">
                  شروع کنید <ArrowLeft className="ms-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">ویژگی‌هایی که ساخت فرم را ساده می‌کنند</h2>
              <p className="mt-4 text-lg text-muted-foreground">هر آنچه برای طراحی فرم‌های موثر و جذاب نیاز دارید.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-card rounded-xl shadow-lg flex flex-col items-center text-center">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">ایجاد با کمک هوش مصنوعی</h3>
                <p className="text-muted-foreground">پیشنهادات هوشمند برای انواع سوالات و قوانین اعتبارسنجی، متناسب با زمینه فرم خود دریافت کنید.</p>
              </div>
              <div className="p-6 bg-card rounded-xl shadow-lg flex flex-col items-center text-center">
                <div className="p-3 bg-accent/10 rounded-full mb-4">
                 <Edit3 className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">ساخت فرم بصری</h3>
                <p className="text-muted-foreground">به راحتی فیلدها را اضافه و پیکربندی کنید تا فرم عالی خود را بسازید (کشیدن و رها کردن به زودی!).</p>
              </div>
              <div className="p-6 bg-card rounded-xl shadow-lg flex flex-col items-center text-center">
                <div className="p-3 bg-secondary/20 rounded-full mb-4">
                  <LayoutGrid className="h-8 w-8 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">مدیریت فرم</h3>
                <p className="text-muted-foreground">تمام فرم‌های خود را در یک داشبورد متمرکز ذخیره، پیش‌نمایش و مدیریت کنید.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-muted border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} فرم‌ایزی. تمام حقوق محفوظ است.</p>
        </div>
      </footer>
    </div>
  );
}
