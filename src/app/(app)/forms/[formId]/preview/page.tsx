import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Eye } from 'lucide-react';

export default function PreviewFormPage({ params }: { params: { formId: string } }) {
  return (
    <div className="space-y-6">
       <Button variant="outline" asChild>
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Eye className="mr-3 h-7 w-7 text-primary" />
            Preview Form: {params.formId}
          </CardTitle>
          <CardDescription>
            This is where you would see a live preview of your form. Functionality to be implemented.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 border border-dashed rounded-lg bg-muted/30 min-h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              Form preview for ID: <strong>{params.formId}</strong> will appear here. <br />
              This will show how the form looks to end-users on different devices.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
