import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Eye } from 'lucide-react'; // For "Back to" in RTL, arrow points to the content direction

export default function PreviewFormPage({ params }: { params: { formId: string } }) {
  return (
    <div className="space-y-6">
       <Button variant="outline" asChild>
        <Link href="/dashboard">
          <ArrowRight className="ms-2 h-4 w-4" /> بازگشت به داشبورد
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Eye className="ms-3 h-7 w-7 text-primary" />
            پیش‌نمایش فرم: {params.formId}
          </CardTitle>
          <CardDescription>
            اینجا جایی است که پیش‌نمایش زنده فرم خود را مشاهده خواهید کرد. قابلیت‌ها پیاده‌سازی خواهند شد.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 border border-dashed rounded-lg bg-muted/30 min-h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              پیش‌نمایش فرم برای شناسه: <strong>{params.formId}</strong> در اینجا ظاهر می‌شود. <br />
              این نشان می‌دهد که فرم برای کاربران نهایی در دستگاه‌های مختلف چگونه به نظر می‌رسد.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
