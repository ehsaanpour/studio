import { CreateFormClient } from '@/components/forms/create-form-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateNewFormPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Create a New Form</CardTitle>
          <CardDescription>
            Describe your form's purpose and let AI help you craft the perfect questions and validation rules.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateFormClient />
        </CardContent>
      </Card>
    </div>
  );
}
