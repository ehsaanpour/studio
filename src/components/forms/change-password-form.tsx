'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

const formSchema = z.object({
  currentPassword: z.string().min(1, 'رمز عبور فعلی الزامی است.'),
  newPassword: z.string().min(6, 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد.'),
  confirmNewPassword: z.string().min(1, 'تایید رمز عبور جدید الزامی است.'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'رمز عبور جدید و تایید آن مطابقت ندارند.',
  path: ['confirmNewPassword'],
});

export function ChangePasswordForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    setIsLoading(false);

    // In a real application, you would send data.currentPassword and data.newPassword to your backend.
    // For now, we'll just show a success toast.
    toast({
      title: 'رمز عبور با موفقیت تغییر یافت',
      description: 'رمز عبور شما با موفقیت به‌روزرسانی شد.',
      action: (
        <div className="flex items-center text-green-500">
          <CheckCircle className="ms-2 h-5 w-5" />
          <span>موفق</span>
        </div>
      ),
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رمز عبور فعلی *</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رمز عبور جدید *</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تایید رمز عبور جدید *</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="ms-2 h-4 w-4 animate-spin" />}
          تغییر رمز عبور
        </Button>
      </form>
    </Form>
  );
}
