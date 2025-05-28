import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutGrid } from 'lucide-react';
import Image from 'next/image';

const templates = [
  { name: "فرم تماس", description: "یک قالب فرم تماس ساده.", image: "https://placehold.co/600x400.png", imageHint: "contact form" },
  { name: "بازخورد رویداد", description: "جمع‌آوری بازخورد پس از یک رویداد.", image: "https://placehold.co/600x400.png", imageHint: "feedback survey"},
  { name: "درخواست کار", description: "یک فرم استاندارد درخواست کار.", image: "https://placehold.co/600x400.png", imageHint: "application document"},
  { name: "ثبت‌نام خبرنامه", description: "فرم ساده برای عضویت در خبرنامه.", image: "https://placehold.co/600x400.png", imageHint: "newsletter email"},
];

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-foreground">قالب‌های فرم</h2>
      <p className="text-muted-foreground">
        با قالب‌های از پیش طراحی شده ما، ساخت فرم خود را سریع شروع کنید. موارد بیشتر به زودی!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(template => (
          <Card key={template.name} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-48 w-full">
               <Image 
                  src={template.image} 
                  alt={template.name} 
                  fill // layout="fill" is deprecated, use fill
                  objectFit="cover"
                  data-ai-hint={template.imageHint}
                />
            </div>
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription className="h-10 truncate">{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-md text-sm font-medium">
                استفاده از قالب
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

       <Card className="mt-12 text-center py-12 bg-muted/50">
        <CardHeader>
          <LayoutGrid className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <CardTitle>قالب‌های بیشتر به زودی!</CardTitle>
          <CardDescription>ما دائماً در حال کار بر روی افزودن قالب‌های جدید هستیم تا به شما کمک کنیم سریعتر شروع کنید.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
