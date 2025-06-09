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
import { Textarea } from '@/components/ui/textarea'; // New Import
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, CheckCircle, Loader2 } from 'lucide-react'; 
import { format as formatDateFnsJalali } from 'date-fns-jalali';
import faIR from 'date-fns-jalali/locale/fa-IR';
import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react';
import { addReservation } from '@/lib/reservation-store';
import { PersianDatePicker } from '@/components/ui/persian-date-picker'; // New Import
import type { AdditionalService } from '@/types';
import { getProgramNames } from '@/lib/program-name-store';

export const producerFormSchema = z.object({
  programName: z.string().min(1, 'نام برنامه الزامی است.'), // New field
  reservationDate: z.date({
    required_error: 'تاریخ رزرو الزامی است.',
  }).refine((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return date >= tomorrow;
  }, 'تاریخ رزرو باید حداقل از فردا باشد.'),
  reservationStartTime: z.string().regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, 'ساعت شروع نامعتبر است (HH:MM).'),
  reservationEndTime: z.string().regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, 'ساعت پایان نامعتبر است (HH:MM).'),
  studioSelection: z.enum(['studio2', 'studio5', 'studio6'], { required_error: 'انتخاب استودیو الزامی است.' }),
  studioServiceType: z.enum(['with_crew', 'without_crew'], { required_error: 'انتخاب سرویس استودیو الزامی است.' }),
  studioServiceDays: z.number().min(1, 'تعداد روز باید حداقل ۱ باشد.'),
  studioServiceHoursPerDay: z.number().min(1, 'تعداد ساعت در روز باید حداقل ۱ باشد.'),
  additionalServices: z.array(z.enum([
    'videowall',
    'xdcam',
    'crane',
    'makeup_artist',
    'service_staff',
    'live_communication',
    'stream',
  ])).optional(),
  details: z.string().optional(), // New field
});

export type ProducerFormValues = z.infer<typeof producerFormSchema>;

const studioOptions = [
  { id: 'studio2', label: 'استودیو ۲ (فرانسه)' },
  { id: 'studio5', label: 'استودیو ۵ (-۳)' },
  { id: 'studio6', label: 'استودیو ۶ (مایا ناصر)' },
];

const additionalServiceItems: { id: AdditionalService; label: string }[] = [
  { id: 'videowall', label: 'ویدئووال' },
  { id: 'xdcam', label: 'XDCAM' },
  { id: 'crane', label: 'کرین' },
  { id: 'makeup_artist', label: 'گریمور' },
  { id: 'service_staff', label: 'نیروی خدمات' },
  { id: 'live_communication', label: 'ارتباط زنده' },
  { id: 'stream', label: 'استریم' },
];

interface ProducerReservationFormProps {
  producerName: string; 
}

export function ProducerReservationForm({ producerName }: ProducerReservationFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [programNames, setProgramNames] = useState<string[]>([]);

  useEffect(() => {
    let isSubscribed = true;

    const fetchAndSetProgramNames = async () => {
      try {
        const names = await getProgramNames();
        if (isSubscribed) {
          setProgramNames(names);
        }
      } catch (error) {
        console.error('Error fetching program names:', error);
      }
    };

    fetchAndSetProgramNames(); // Initial fetch
    return () => {
      isSubscribed = false;
    };
  }, []);

  const form = useForm<ProducerFormValues>({
    resolver: zodResolver(producerFormSchema),
    defaultValues: {
      programName: '', 
      reservationDate: new Date(), 
      reservationStartTime: '09:00',
      reservationEndTime: '17:00',
      studioSelection: undefined,
      studioServiceType: undefined,
      studioServiceDays: 1,
      studioServiceHoursPerDay: 8,
      additionalServices: [],
      details: '', 
    },
  });

  async function onSubmit(data: ProducerFormValues) {
    setIsLoading(true);
    console.log('Producer Reservation Data Submitted:', data, 'by', producerName);
    
    addReservation(data, 'producer', producerName);

    await new Promise(resolve => setTimeout(resolve, 500)); 
    setIsLoading(false);
    toast({
      title: 'درخواست شما ثبت شد',
      description: 'درخواست رزرو شما با موفقیت برای بررسی ارسال شد.',
      action: (
        <div className="flex items-center text-green-500">
          <CheckCircle className="ms-2 h-5 w-5" />
          <span>موفق</span>
        </div>
      ),
    });
    form.reset({ // Reset form to default values
      programName: '', // Reset new field
      reservationDate: new Date(),
      reservationStartTime: '09:00',
      reservationEndTime: '17:00',
      studioSelection: undefined,
      studioServiceType: undefined,
      studioServiceDays: 1,
      studioServiceHoursPerDay: 8,
      additionalServices: [],
      details: '', // Reset new field
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8" dir="rtl">
        {/* Program Name */}
        <div className="space-y-4 p-4 sm:p-6 border rounded-lg shadow-sm bg-card">
          <h3 className="text-lg sm:text-xl font-semibold text-primary border-b pb-2 mb-4">اطلاعات برنامه</h3>
          <FormField
            control={form.control}
            name="programName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نام برنامه *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full text-right">
                      <SelectValue placeholder="یک برنامه را انتخاب کنید" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {programNames.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-muted-foreground text-right">
                        ابتدا در پنل تهیه‌کننده نام برنامه اضافه کنید.
                      </div>
                    ) : (
                      programNames.map((name) => (
                        <SelectItem key={name} value={name} className="text-right">
                          {name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Reservation Date and Time */}
        <div className="space-y-4 p-4 sm:p-6 border rounded-lg shadow-sm bg-card">
          <h3 className="text-lg sm:text-xl font-semibold text-primary border-b pb-2 mb-4">تاریخ و ساعت رزرو</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
            <FormField
              control={form.control}
              name="reservationDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>تاریخ رزرو *</FormLabel>
                  <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-end text-right font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            formatDateFnsJalali(field.value, 'PPP', { locale: faIR })
                          ) : (
                            <span>یک تاریخ انتخاب کنید</span>
                          )}
                          <CalendarIcon className="me-2 h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <PersianDatePicker
                        value={field.value}
                        onChange={(date) => {
                           field.onChange(date);
                           setIsDatePickerOpen(false);
                        }}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const tomorrow = new Date(today);
                          tomorrow.setDate(today.getDate() + 1);
                          return date < tomorrow;
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-sm text-muted-foreground mt-1 text-right">توجه: امکان رزرو برای روز جاری وجود ندارد. لطفاً از فردا به بعد را انتخاب کنید.</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reservationStartTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ساعت شروع برنامه *</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} className="w-full text-right" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reservationEndTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ساعت پایان برنامه *</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} className="w-full text-right" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Studio Selection */}
        <div className="space-y-4 p-4 sm:p-6 border rounded-lg shadow-sm bg-card">
          <h3 className="text-lg sm:text-xl font-semibold text-primary border-b pb-2 mb-4">انتخاب استودیو</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="studioSelection"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>استودیو *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {studioOptions.map((option) => (
                        <FormItem
                          key={option.id}
                          className="flex items-center space-x-3 space-x-reverse"
                        >
                          <FormControl>
                            <RadioGroupItem value={option.id} />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {option.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="studioServiceType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>نوع سرویس استودیو *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-x-reverse">
                        <FormControl>
                          <RadioGroupItem value="with_crew" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          استودیو با عوامل پخش
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-x-reverse">
                        <FormControl>
                          <RadioGroupItem value="without_crew" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          فضای استودی و یک نیروی فنی
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Service Details */}
        <div className="space-y-4 p-4 sm:p-6 border rounded-lg shadow-sm bg-card">
          <h3 className="text-lg sm:text-xl font-semibold text-primary border-b pb-2 mb-4">جزئیات سرویس</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="studioServiceDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تعداد روز *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="w-full text-right"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="studioServiceHoursPerDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تعداد ساعت در روز *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="w-full text-right"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Additional Services */}
        <div className="space-y-4 p-4 sm:p-6 border rounded-lg shadow-sm bg-card">
          <h3 className="text-lg sm:text-xl font-semibold text-primary border-b pb-2 mb-4">سرویس‌های تکمیلی</h3>
          <FormField
            control={form.control}
            name="additionalServices"
            render={() => (
              <FormItem>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {additionalServiceItems.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="additionalServices"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-x-reverse"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value || [], item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Additional Details */}
        <div className="space-y-4 p-4 sm:p-6 border rounded-lg shadow-sm bg-card">
          <h3 className="text-lg sm:text-xl font-semibold text-primary border-b pb-2 mb-4">توضیحات تکمیلی</h3>
          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>توضیحات</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="توضیحات تکمیلی خود را وارد کنید..."
                    className="resize-none min-h-[100px] text-right"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
          {isLoading ? (
            <>
              <span>در حال ثبت...</span>
              <Loader2 className="me-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            'ثبت درخواست'
          )}
        </Button>
      </form>
    </Form>
  );
}
