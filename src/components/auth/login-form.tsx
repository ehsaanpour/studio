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
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProducerByUsername } from '@/lib/producer-store';

const loginFormSchema = z.object({
  username: z.string().min(1, { message: 'نام کاربری الزامی است.' }),
  password: z.string().min(1, { message: 'رمز عبور الزامی است.' }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    try {
      // Check if it's an admin login
      if (data.username === 'admin' && data.password === 'admin') {
        toast({
          title: 'ورود موفق',
          description: 'شما به عنوان مدیر وارد شدید.',
        });
        router.push('/admin');
        return;
      }

      // Try to find the producer
      const producer = await getProducerByUsername(data.username);
      
      if (!producer) {
        throw new Error('Producer not found');
      }

      // For now, we'll use a simple password check
      // In a real application, you should use proper password hashing
      if (data.password === 'producer') {
        toast({
          title: 'ورود موفق',
          description: 'شما به عنوان تهیه‌کننده وارد شدید.',
        });
        router.push('/producer');
      } else {
        throw new Error('Invalid password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'خطا در ورود',
        description: 'نام کاربری یا رمز عبور نامعتبر است.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نام کاربری</FormLabel>
              <FormControl>
                <Input placeholder="نام کاربری خود را وارد کنید" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رمز عبور</FormLabel>
              <FormControl>
                <Input type="password" placeholder="رمز عبور خود را وارد کنید" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="ms-2 h-4 w-4 animate-spin" />}
          ورود
        </Button>
      </form>
    </Form>
  );
}
