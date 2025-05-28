import { CreateFormClient } from '@/components/forms/create-form-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateNewFormPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">ایجاد فرم جدید</CardTitle>
          <CardDescription>
            هدف فرم خود را شرح دهید و به هوش مصنوعی اجازه دهید به شما در ایجاد سوالات و قوانین اعتبارسنجی عالی کمک کند.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateFormClient />
        </CardContent>
      </Card>
    </div>
  );
}
