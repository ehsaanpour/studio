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
  programName: z.string().min(1, 'نام برنامه الزامی است.'),
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
  repetitionType: z.enum(['no_repetition', 'weekly_1month', 'weekly_2months', 'daily_until_date'], { required_error: 'انتخاب نوع تکرار الزامی است.' }),
  repetitionEndDate: z.date().optional().refine((date) => {
    if (!date) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, 'تاریخ پایان باید از امروز به بعد باشد.'),
  additionalServices: z.array(z.enum([
    'videowall',
    'xdcam',
    'crane',
    'makeup_artist',
    'service_staff',
    'live_communication',
    'stream',
  ])).optional(),
  details: z.string().optional(),
}).refine((data) => {
  if (data.additionalServices?.includes('live_communication') || data.additionalServices?.includes('stream')) {
    return data.details && data.details.trim().length > 0;
  }
  return true;
}, {
  message: 'در صورت انتخاب ارتباط زنده یا استریم، توضیحات تکمیلی الزامی است.',
  path: ['details'],
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
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);
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
      repetitionType: undefined,
      repetitionEndDate: undefined,
      additionalServices: [],
      details: '', 
    },
  });

  async function onSubmit(data: ProducerFormValues) {
    setIsLoading(true);
    console.log('Producer Reservation Data Submitted:', data, 'by', producerName);
    
    try {
      let reservationsToCreate = [];
      
      if (data.repetitionType === 'no_repetition') {
        // Create single reservation
        reservationsToCreate.push(data);
      } else if (data.repetitionType === 'daily_until_date' && data.repetitionEndDate) {
        // Calculate number of days between start and end date
        const startDate = new Date(data.reservationDate);
        const endDate = new Date(data.repetitionEndDate);
        const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Create a reservation for each day
        for (let i = 0; i <= daysDiff; i++) {
          const reservationDate = new Date(startDate);
          reservationDate.setDate(startDate.getDate() + i);
          reservationsToCreate.push({
            ...data,
            reservationDate,
          });
        }
      } else {
        // Handle weekly repetitions
        const weeks = data.repetitionType === 'weekly_1month' ? 4 : 8;
        for (let i = 0; i < weeks; i++) {
          const reservationDate = new Date(data.reservationDate);
          reservationDate.setDate(reservationDate.getDate() + (i * 7));
          reservationsToCreate.push({
            ...data,
            reservationDate,
          });
        }
      }

      // Check availability for all reservations before creating them
      for (const reservationData of reservationsToCreate) {
        const response = await fetch('/api/reservations/check-availability', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dateTime: {
              reservationDate: reservationData.reservationDate,
              startTime: reservationData.reservationStartTime,
              endTime: reservationData.reservationEndTime,
            },
            studio: reservationData.studioSelection,
          }),
        });

        const { isAvailable, message } = await response.json();
        
        if (!isAvailable) {
          toast({
            title: 'زمان رزرو در دسترس نیست',
            description: message,
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }
      }

      // Create all reservations if all times are available
      for (const reservationData of reservationsToCreate) {
        await addReservation(reservationData, 'producer', producerName);
      }

      toast({
        title: 'درخواست شما ثبت شد',
        description: `درخواست رزرو شما با موفقیت برای ${reservationsToCreate.length} روز ارسال شد.`,
        action: (
          <div className="flex items-center text-green-500">
            <CheckCircle className="ms-2 h-5 w-5" />
            <span>موفق</span>
          </div>
        ),
      });
    } catch (error) {
      console.error('Error submitting reservation:', error);
      toast({
        title: 'خطا در ثبت درخواست',
        description: 'متأسفانه در ثبت درخواست شما مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      form.reset({
        programName: '',
        reservationDate: new Date(),
        reservationStartTime: '09:00',
        reservationEndTime: '17:00',
        studioSelection: undefined,
        studioServiceType: undefined,
        repetitionType: undefined,
        repetitionEndDate: undefined,
        additionalServices: [],
        details: '',
      });
    }
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
              name="repetitionType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>تکرار برنامه *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-x-reverse rtl:space-x-reverse">
                        <FormControl>
                          <RadioGroupItem value="no_repetition" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          بدون تکرار
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-x-reverse rtl:space-x-reverse">
                        <FormControl>
                          <RadioGroupItem value="weekly_1month" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          هفتگی (یک ماه)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-x-reverse rtl:space-x-reverse">
                        <FormControl>
                          <RadioGroupItem value="weekly_2months" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          هفتگی (دو ماه)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-x-reverse rtl:space-x-reverse">
                        <FormControl>
                          <RadioGroupItem value="daily_until_date" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          روزانه تا تاریخ مشخص
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch('repetitionType') === 'daily_until_date' && (
              <FormField
                control={form.control}
                name="repetitionEndDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>تاریخ پایان تکرار *</FormLabel>
                    <Popover open={isEndDatePickerOpen} onOpenChange={setIsEndDatePickerOpen}>
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
                            setIsEndDatePickerOpen(false);
                          }}
                          disabled={(date) => {
                            const startDate = form.getValues('reservationDate');
                            return date < startDate;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
                <div className="mb-4">
                  <FormLabel className="text-base">سرویس‌های مورد نیاز را انتخاب کنید</FormLabel>
                  <p className="text-sm text-muted-foreground mt-2">
                    در صورت انتخاب پخش زنده و استریم، لطفا بستر پخش زنده مانند گوگل میت، زوم، مایکروسافت تیمز و... 
                    و برای پخش زنده بسترهای آن مثل یوتیوب، اینستاگرام، آپارات و... در قسمت توضیحات به صورت کامل درج شود.
                  </p>
                </div>
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
                            className="flex flex-row items-start space-x-3 space-x-reverse rtl:space-x-reverse p-4 border rounded-lg"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
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
                    placeholder={
                      form.watch('additionalServices')?.includes('live_communication') || 
                      form.watch('additionalServices')?.includes('stream')
                        ? "لطفاً بستر پخش زنده و بسترهای آن را مشخص کنید..."
                        : "توضیحات تکمیلی خود را وارد کنید..."
                    }
                    className="resize-none"
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
