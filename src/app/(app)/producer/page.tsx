import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Film, PlusCircle, ListOrdered, ArrowRight } from 'lucide-react';

// Mock data for producer
const mockProducer = {
  name: 'جناب آقای رضایی', // Example producer name
};

export default function ProducerPanelPage() {
  return (
    <div className="space-y-6">
       <Button variant="outline" asChild className="mb-6">
        <Link href="/dashboard">
          <ArrowRight className="ms-2 h-4 w-4" /> بازگشت به داشبورد
        </Link>
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold flex items-center">
                <Film className="ms-3 h-8 w-8 text-primary" />
                پنل تهیه‌کننده
              </CardTitle>
              <CardDescription>خوش آمدید، {mockProducer.name}!</CardDescription>
            </div>
            <Button asChild>
              <Link href="/producer/new-request">
                <PlusCircle className="ms-2 h-5 w-5" /> ثبت درخواست جدید
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-muted-foreground">
            از این پنل می‌توانید درخواست‌های رزرو جدید ثبت کرده و درخواست‌های قبلی خود را مشاهده و مدیریت نمایید.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center"><PlusCircle className="ms-2 h-6 w-6 text-accent"/> ایجاد رزرو جدید</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  فرم رزرو برای تهیه‌کنندگان شامل تاریخ، ساعت، انتخاب استودیو، خدمات استودیو و خدمات جانبی خواهد بود.
                  اطلاعات شخصی شما به صورت خودکار در نظر گرفته می‌شود.
                </p>
                <Button className="w-full" asChild>
                  <Link href="/producer/new-request">شروع رزرو جدید</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center"><ListOrdered className="ms-2 h-6 w-6 text-secondary-foreground"/> مشاهده درخواست‌های من</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  لیستی از تمامی درخواست‌های رزرو ثبت شده توسط شما، همراه با وضعیت آن‌ها.
                </p>
                <Button variant="outline" className="w-full" disabled>
                  مشاهده درخواست‌ها (به زودی)
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Placeholder for producer reservation form or list of reservations */}
          <div className="mt-8 p-6 border border-dashed rounded-lg bg-muted/30 min-h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              محتوای اصلی پنل تهیه‌کننده در اینجا قرار خواهد گرفت.<br/>
              (فرم رزرو اختصاصی و لیست رزروهای قبلی)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
