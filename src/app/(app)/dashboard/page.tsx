import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, FileText, Edit, Eye, Download } from 'lucide-react';
import Image from 'next/image';

// Mock data for forms
const mockForms = [
  { id: '1', name: 'Customer Feedback Survey', description: 'Collect feedback from recent customers.', submissions: 120, createdAt: '2024-07-15', image: 'https://placehold.co/600x400.png', imageHint: 'survey chart' },
  { id: '2', name: 'Event Registration Form', description: 'Register attendees for the annual tech conference.', submissions: 85, createdAt: '2024-07-10', image: 'https://placehold.co/600x400.png', imageHint: 'event form' },
  { id: '3', name: 'Job Application Form', description: 'Collect applications for open positions.', submissions: 45, createdAt: '2024-07-05', image: 'https://placehold.co/600x400.png', imageHint: 'application office' },
  { id: '4', name: 'Contact Us Form', description: 'Allow website visitors to get in touch.', submissions: 210, createdAt: '2024-06-28', image: 'https://placehold.co/600x400.png', imageHint: 'contact mail' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">My Forms</h2>
        <Button asChild>
          <Link href="/forms/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Form
          </Link>
        </Button>
      </div>

      {mockForms.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <FileText className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle>No Forms Yet</CardTitle>
            <CardDescription>Start creating your first form to collect data.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/forms/new">
                <PlusCircle className="mr-2 h-5 w-5" /> Create Your First Form
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
                  layout="fill" 
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
                  Submissions: <span className="font-semibold text-foreground">{form.submissions}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Created: <span className="font-semibold text-foreground">{form.createdAt}</span>
                </p>
              </CardContent>
              <CardFooter className="grid grid-cols-3 gap-2 p-4 border-t">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/forms/${form.id}/edit`}>
                    <Edit className="mr-1 h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Edit</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/forms/${form.id}/preview`}>
                    <Eye className="mr-1 h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Preview</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-1 h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Export</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
