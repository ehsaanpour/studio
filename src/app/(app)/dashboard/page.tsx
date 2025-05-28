import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, FileText, Edit, Eye, Download } from 'lucide-react';
import Image from 'next/image';

// Mock data for forms
const mockForms = [
  { id: '1', name: 'نظرسنجی بازخورد مشتری', description: 'جمع‌آوری بازخورد از مشتریان اخیر.', submissions: 120, createdAt: '2024-07-15', image: 'https://placehold.co/600x400.png', imageHint: 'survey chart' },
  { id: '2', name: 'فرم ثبت‌نام رویداد', description: 'ثبت‌نام شرکت‌کنندگان برای کنفرانس سالانه فناوری.', submissions: 85, createdAt: '2024-07-10', image: 'https://placehold.co/600x400.png', imageHint: 'event form' },
  { id: '3', name: 'فرم درخواست کار', description: 'جمع‌آوری درخواست‌ها برای موقعیت‌های شغلی باز.', submissions: 45, createdAt: '2024-07-05', image: 'https://placehold.co/600x400.png', imageHint: 'application office' },
  { id: '4', name: 'فرم تماس با ما', description: 'به بازدیدکنندگان وب‌سایت اجازه دهید با ما در تماس باشند.', submissions: 210, createdAt: '2024-06-28', image: 'https://placehold.co/600x400.png', imageHint: 'contact mail' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">فرم‌های من</h2>
        <Button asChild>
          <Link href="/forms/new">
            <PlusCircle className="ms-2 h-5 w-5" /> ایجاد فرم جدید
          </Link>
        </Button>
      </div>

      {mockForms.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <FileText className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle>هنوز فرمی وجود ندارد</CardTitle>
            <CardDescription>برای جمع‌آوری داده، اولین فرم خود را ایجاد کنید.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/forms/new">
                <PlusCircle className="ms-2 h-5 w-5" /> اولین فرم خود را ایجاد کنید
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockForms.map((form) => (
            <Card key={form.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <Image 
                  src={form.image} 
                  alt={form.name} 
                  fill // layout="fill" is deprecated, use fill
                  objectFit="cover"
                  data-ai-hint={form.imageHint}
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{form.name}</CardTitle>
                <CardDescription className="truncate h-10">{form.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">
                  ارسال‌ها: <span className="font-semibold text-foreground">{form.submissions}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  ایجاد شده در: <span className="font-semibold text-foreground">{form.createdAt}</span>
                </p>
              </CardContent>
              <CardFooter className="grid grid-cols-3 gap-2 p-4 border-t">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/forms/${form.id}/edit`}>
                    <Edit className="ms-1 h-4 w-4 sm:ms-2" /> <span className="hidden sm:inline">ویرایش</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/forms/${form.id}/preview`}>
                    <Eye className="ms-1 h-4 w-4 sm:ms-2" /> <span className="hidden sm:inline">پیش‌نمایش</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="ms-1 h-4 w-4 sm:ms-2" /> <span className="hidden sm:inline">خروجی</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
