import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutGrid } from 'lucide-react';
import Image from 'next/image';

const templates = [
  { name: "Contact Form", description: "A simple contact form template.", image: "https://placehold.co/600x400.png", imageHint: "contact form" },
  { name: "Event Feedback", description: "Collect feedback after an event.", image: "https://placehold.co/600x400.png", imageHint: "feedback survey"},
  { name: "Job Application", description: "A standard job application form.", image: "https://placehold.co/600x400.png", imageHint: "application document"},
  { name: "Newsletter Signup", description: "Simple form to subscribe to a newsletter.", image: "https://placehold.co/600x400.png", imageHint: "newsletter email"},
];

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-foreground">Form Templates</h2>
      <p className="text-muted-foreground">
        Kickstart your form creation with our pre-designed templates. More coming soon!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(template => (
          <Card key={template.name} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-48 w-full">
               <Image 
                  src={template.image} 
                  alt={template.name} 
                  layout="fill" 
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
                Use Template
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

       <Card className="mt-12 text-center py-12 bg-muted/50">
        <CardHeader>
          <LayoutGrid className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <CardTitle>More Templates Coming Soon!</CardTitle>
          <CardDescription>We are constantly working on adding new templates to help you get started faster.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
