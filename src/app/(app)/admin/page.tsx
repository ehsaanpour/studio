import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UserCog, Users, ListChecks, PlusSquare, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminPanelPage() {
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
            <UserCog className="ms-3 h-8 w-8 text-primary" />
            پنل مدیریت سیستم رزرواسیون
          </CardTitle>
          <CardDescription>مدیریت درخواست‌های رزرو، تهیه‌کنندگان و تنظیمات کلی سیستم.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="requests" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="requests"><ListChecks className="me-2 h-4 w-4"/> مدیریت درخواست‌ها</TabsTrigger>
              <TabsTrigger value="producers"><Users className="me-2 h-4 w-4"/> مدیریت تهیه‌کنندگان</TabsTrigger>
              <TabsTrigger value="settings"><PlusSquare className="me-2 h-4 w-4"/> افزودن تهیه‌کننده</TabsTrigger>
            </TabsList>
            
            <TabsContent value="requests">
              <Card>
                <CardHeader>
                  <CardTitle>درخواست‌های رزرو</CardTitle>
                  <CardDescription>مشاهده و مدیریت تمامی درخواست‌های ثبت شده توسط مهمانان و تهیه‌کنندگان.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Placeholder for request lists (New/Old) */}
                  <div className="p-6 border border-dashed rounded-lg bg-muted/30 min-h-[200px] flex items-center justify-center">
                    <p className="text-muted-foreground text-center">
                      لیست درخواست‌های جدید و خوانده شده در اینجا نمایش داده می‌شود. <br/>
                      امکان علامت‌گذاری به عنوان خوانده شده نیز فراهم خواهد شد.
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    درخواست‌های جدید بر اساس جدیدترین ابتدا مرتب می‌شوند. هر درخواست شامل تمامی اطلاعات فرم خواهد بود.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="producers">
              <Card>
                <CardHeader>
                  <CardTitle>مدیریت تهیه‌کنندگان</CardTitle>
                  <CardDescription>مشاهده لیست تهیه‌کنندگان موجود و امکان ویرایش یا حذف آن‌ها.</CardDescription>
                </CardHeader>
                <CardContent>
                   {/* Placeholder for producers list */}
                   <div className="p-6 border border-dashed rounded-lg bg-muted/30 min-h-[150px] flex items-center justify-center">
                    <p className="text-muted-foreground text-center">
                      لیست تهیه‌کنندگان و ابزارهای مدیریتی آن‌ها در اینجا قرار می‌گیرد.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>افزودن تهیه‌کننده جدید</CardTitle>
                  <CardDescription>برای افزودن یک تهیه‌کننده جدید به سیستم، فرم زیر را تکمیل کنید.</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Placeholder for Add Producer Form */}
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="producerName" className="block text-sm font-medium text-foreground">نام</label>
                      <input type="text" id="producerName" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-input" placeholder="نام کامل تهیه‌کننده"/>
                    </div>
                    <div>
                      <label htmlFor="producerWorkplace" className="block text-sm font-medium text-foreground">محل کار</label>
                      <input type="text" id="producerWorkplace" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-input" placeholder="نام دقیق قسمت در خواست دهنده استودیو را بنویسید"/>
                    </div>
                    <div>
                      <label htmlFor="producerUsername" className="block text-sm font-medium text-foreground">نام کاربری</label>
                      <input type="text" id="producerUsername" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-input" placeholder="برای ورود به سیستم"/>
                    </div>
                    <div>
                      <label htmlFor="producerPassword" className="block text-sm font-medium text-foreground">رمز عبور</label>
                      <input type="password" id="producerPassword" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-input" placeholder="یک رمز عبور قوی انتخاب کنید"/>
                    </div>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <PlusSquare className="ms-2 h-4 w-4"/> افزودن تهیه‌کننده
                    </Button>
                  </form>
                   <p className="mt-4 text-xs text-muted-foreground">
                    این بخش برای افزودن تهیه‌کنندگان طراحی شده و قابلیت توسعه برای تنظیمات بیشتر را دارد.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
