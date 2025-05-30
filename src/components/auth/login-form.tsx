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
import { getProducerByUsername, verifyProducerPassword } from '@/lib/producer-store';
import { useAuth } from '@/lib/auth-context';

const loginFormSchema = z.object({
  username: z.string().min(1, { message: 'نام کاربری الزامی است.' }),
  password: z.string().min(1, { message: 'رمز عبور الزامی است.' }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

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
        const success = await login(data.username, data.password);
        if (success) {
          toast({
            title: 'ورود موفق',
            description: 'شما به عنوان مدیر وارد شدید.',
          });
          router.push('/admin');
        }
        return;
      }

      // Try to find the producer
      const producer = await getProducerByUsername(data.username);
      
      if (!producer) {
        toast({
          title: 'خطا در ورود',
          description: 'کاربری با این نام کاربری یافت نشد.',
          variant: 'destructive',
        });
        return;
      }

      // Verify the password using bcrypt
      const isValidPassword = await verifyProducerPassword(data.username, data.password);
      
      if (isValidPassword) {
        const success = await login(data.username, data.password);
        if (success) {
          toast({
            title: 'ورود موفق',
            description: 'شما به عنوان تهیه‌کننده وارد شدید.',
          });
          router.push('/producer');
        }
      } else {
        toast({
          title: 'خطا در ورود',
          description: 'رمز عبور اشتباه است.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'خطا در ورود',
        description: 'خطایی در سیستم رخ داده است. لطفا دوباره تلاش کنید.',
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
              <FormLabel className="text-gray-300">نام کاربری</FormLabel>
              <FormControl>
                <Input
                  placeholder="نام کاربری خود را وارد کنید"
                  {...field}
                  className="bg-[#334155] border-gray-700 text-white placeholder-gray-500 focus:border-blue-500"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">رمز عبور</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="رمز عبور خود را وارد کنید"
                  {...field}
                  className="bg-[#334155] border-gray-700 text-white placeholder-gray-500 focus:border-blue-500"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="ms-2 h-4 w-4 animate-spin" />}
          ورود
        </Button>
      </form>
    </Form>
  );
}
