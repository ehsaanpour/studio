
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UserCog, Users, ListChecks, PlusSquare, ArrowRight, Edit3, Trash2, CheckCircle, Inbox, MailOpen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState, FormEvent, useEffect } from 'react';
import type { Producer, StudioReservationRequest, AdditionalService, CateringService } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { getReservations, subscribe, updateReservationStatus } from '@/lib/reservation-store';
import { format } from 'date-fns-jalali';
import faIR from 'date-fns-jalali/locale/fa-IR';
import { Badge } from '@/components/ui/badge';

// Helper function to get studio label
const getStudioLabel = (studioId: StudioReservationRequest['studio']) => {
  switch (studioId) {
    case 'studio2': return 'استودیو ۲ (فرانسه)';
    case 'studio5': return 'استودیو ۵ (-۳)';
    case 'studio6': return 'استودیو ۶ (مایا ناصر)';
    default: return 'نامشخص';
  }
};

// Helper function to get service type label
const getServiceTypeLabel = (serviceType: StudioReservationRequest['studioServices']['serviceType']) => {
  switch (serviceType) {
    case 'with_crew': return 'با عوامل';
    case 'without_crew': return 'بدون عوامل';
    default: return 'نامشخص';
  }
};

const additionalServiceItemsMap: Record<AdditionalService, string> = {
  videowall: 'ویدئووال',
  led_monitor: 'LED Monitor',
  xdcam: 'XDCAM',
  stream_iranian: 'استریم روی سرویس‌های ایرانی',
  stream_foreign: 'استریم روی سرویس‌های خارجی',
  stream_server: 'راه‌اندازی سرور استریم شخصی',
  zoom: 'ZOOM',
  google_meet: 'Google Meet',
  ms_teams: 'Microsoft Teams',
  lobby: 'لابی پذیرایی مهمان',
  crane: 'کرین',
  makeup_artist: 'گریمور',
  service_staff: 'نیروی خدمات',
};

const getAdditionalServiceLabel = (serviceId: AdditionalService): string => {
  return additionalServiceItemsMap[serviceId] || serviceId;
};

const cateringServiceItemsMap: Record<CateringService, string> = {
  drinks: 'نوشیدنی',
  breakfast: 'صبحانه',
  snack: 'میان وعده',
  lunch: 'ناهار',
  dinner: 'شام',
};

const getCateringServiceLabel = (serviceId: CateringService): string => {
  return cateringServiceItemsMap[serviceId] || serviceId;
};


export default function AdminPanelPage() {
  const { toast } = useToast();
  const [producers, setProducers] = useState<Producer[]>([]);
  const [allRequests, setAllRequests] = useState<StudioReservationRequest[]>([]);
  
  const [newProducerName, setNewProducerName] = useState('');
  const [newProducerWorkplace, setNewProducerWorkplace] = useState('');
  const [newProducerUsername, setNewProducerUsername] = useState('');
  const [newProducerPassword, setNewProducerPassword] = useState('');

  useEffect(() => {
    setAllRequests(getReservations());
    const unsubscribe = subscribe(() => {
      setAllRequests(getReservations());
    });
    return () => unsubscribe();
  }, []);

  const newSystemRequests = allRequests.filter(req => req.status === 'new');
  const oldSystemRequests = allRequests.filter(req => req.status !== 'new');


  const handleAddProducer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newProducerName || !newProducerWorkplace || !newProducerUsername || !newProducerPassword) {
      toast({
        title: "خطا",
        description: "لطفاً تمامی فیلدها را تکمیل کنید.",
        variant: "destructive",
      });
      return;
    }

    const newProducer: Producer = {
      id: Date.now().toString(),
      name: newProducerName,
      workplace: newProducerWorkplace,
      username: newProducerUsername,
    };
    setProducers(prevProducers => [...prevProducers, newProducer]);
    
    setNewProducerName('');
    setNewProducerWorkplace('');
    setNewProducerUsername('');
    setNewProducerPassword('');

    toast({
      title: "موفقیت",
      description: `تهیه‌کننده "${newProducer.name}" با موفقیت اضافه شد.`,
    });
  };

  const handleDeleteProducer = (producerId: string) => {
    setProducers(prevProducers => prevProducers.filter(p => p.id !== producerId));
    toast({
      title: "موفقیت",
      description: "تهیه‌کننده با موفقیت حذف شد.",
      variant: "default" 
    });
  };

  const handleMarkAsRead = (requestId: string) => {
    updateReservationStatus(requestId, 'read');
    toast({
      title: "وضعیت بروز شد",
      description: "درخواست به عنوان خوانده شده علامت‌گذاری شد.",
    });
  };

  const renderRequestCard = (request: StudioReservationRequest, isNew: boolean) => (
    <Card key={request.id} className="shadow-sm mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">درخواست از: {request.requesterName || (request.type === 'guest' ? request.personalInfo?.nameOrOrganization : 'تهیه‌کننده نامشخص')}</CardTitle>
            <CardDescription>
              تاریخ ثبت: {format(new Date(request.submittedAt), 'PPP p', { locale: faIR })} - نوع: {request.type === 'guest' ? 'مهمان' : 'تهیه‌کننده'}
            </CardDescription>
          </div>
          <Badge variant={request.status === 'new' ? 'destructive' : 'secondary'}>
            {request.status === 'new' ? 'جدید' : request.status === 'read' ? 'خوانده شده' : request.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p><strong>تاریخ رزرو:</strong> {format(new Date(request.dateTime.reservationDate), 'PPP', { locale: faIR })} از {request.dateTime.startTime} تا {request.dateTime.endTime}</p>
        <p><strong>استودیو:</strong> {getStudioLabel(request.studio)}</p>
        <p><strong>نوع سرویس:</strong> {getServiceTypeLabel(request.studioServices.serviceType)} ({request.studioServices.numberOfDays} روز, {request.studioServices.hoursPerDay} ساعت/روز)</p>
        {request.personalInfo && (
          <>
            <p><strong>تماس مهمان:</strong> {request.personalInfo.phoneNumber} - {request.personalInfo.emailAddress}</p>
          </>
        )}
        {request.additionalServices && request.additionalServices.length > 0 && (
          <p><strong>خدمات جانبی:</strong> {request.additionalServices.map(getAdditionalServiceLabel).join('، ')}</p>
        )}
        {request.cateringServices && request.cateringServices.length > 0 && (
           <p><strong>خدمات پذیرایی:</strong> {request.cateringServices.map(getCateringServiceLabel).join('، ')}</p>
        )}
      </CardContent>
      {isNew && (
        <CardFooter>
          <Button onClick={() => handleMarkAsRead(request.id)} size="sm" variant="outline">
            علامت‌گذاری به عنوان خوانده شده <CheckCircle className="me-2 h-4 w-4" /> 
          </Button>
        </CardFooter>
      )}
    </Card>
  );


  return (
    <div className="space-y-6">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/dashboard">
          بازگشت به داشبورد <ArrowRight className="me-2 h-4 w-4" />
        </Link>
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center">
            پنل مدیریت سیستم رزرواسیون <UserCog className="me-3 h-8 w-8 text-primary" />
          </CardTitle>
          <CardDescription>مدیریت درخواست‌های رزرو، تهیه‌کنندگان و تنظیمات کلی سیستم.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="requests" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="requests">مدیریت درخواست‌ها <ListChecks className="me-2 h-4 w-4"/></TabsTrigger>
              <TabsTrigger value="producers">مدیریت تهیه‌کنندگان <Users className="me-2 h-4 w-4"/></TabsTrigger>
              <TabsTrigger value="add-producer">افزودن تهیه‌کننده <PlusSquare className="me-2 h-4 w-4"/></TabsTrigger>
            </TabsList>
            
            <TabsContent value="requests">
              <Card>
                <CardHeader>
                  <CardTitle>درخواست‌های رزرو</CardTitle>
                  <CardDescription>مشاهده و مدیریت تمامی درخواست‌های ثبت شده.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="new-requests" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="new-requests">
                        درخواست‌های جدید ({newSystemRequests.length}) <Inbox className="me-2 h-4 w-4" />
                      </TabsTrigger>
                      <TabsTrigger value="old-requests">
                         درخواست‌های خوانده شده ({oldSystemRequests.length}) <MailOpen className="me-2 h-4 w-4" />
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="new-requests">
                      {newSystemRequests.length === 0 ? (
                        <p className="text-muted-foreground py-4 text-center">هیچ درخواست جدیدی وجود ندارد.</p>
                      ) : (
                        newSystemRequests.map(req => renderRequestCard(req, true))
                      )}
                    </TabsContent>
                    <TabsContent value="old-requests">
                      {oldSystemRequests.length === 0 ? (
                         <p className="text-muted-foreground py-4 text-center">هیچ درخواست خوانده شده‌ای وجود ندارد.</p>
                      ) : (
                        oldSystemRequests.map(req => renderRequestCard(req, false))
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="producers">
              <Card>
                <CardHeader>
                  <CardTitle>لیست تهیه‌کنندگان</CardTitle>
                  <CardDescription>مشاهده لیست تهیه‌کنندگان موجود و امکان ویرایش یا حذف آن‌ها.</CardDescription>
                </CardHeader>
                <CardContent>
                  {producers.length === 0 ? (
                    <div className="p-6 border border-dashed rounded-lg bg-muted/30 min-h-[150px] flex items-center justify-center">
                      <p className="text-muted-foreground text-center">
                        هیچ تهیه‌کننده‌ای یافت نشد. برای افزودن، به تب "افزودن تهیه‌کننده" بروید.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {producers.map(producer => (
                        <Card key={producer.id} className="shadow-sm">
                          <CardHeader>
                            <CardTitle className="text-lg">{producer.name}</CardTitle>
                            <CardDescription>{producer.workplace} (نام کاربری: {producer.username})</CardDescription>
                          </CardHeader>
                          <CardFooter className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" disabled>
                              ویرایش <Edit3 className="me-1 h-4 w-4" /> 
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteProducer(producer.id)}>
                              حذف <Trash2 className="me-1 h-4 w-4" /> 
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="add-producer">
              <Card>
                <CardHeader>
                  <CardTitle>افزودن تهیه‌کننده جدید</CardTitle>
                  <CardDescription>برای افزودن یک تهیه‌کننده جدید به سیستم، فرم زیر را تکمیل کنید.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddProducer} className="space-y-4">
                    <div>
                      <Label htmlFor="producerName">نام *</Label>
                      <Input 
                        type="text" 
                        id="producerName" 
                        value={newProducerName}
                        onChange={(e) => setNewProducerName(e.target.value)}
                        className="mt-1" 
                        placeholder="نام کامل تهیه‌کننده"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="producerWorkplace">محل کار *</Label>
                      <Input 
                        type="text" 
                        id="producerWorkplace" 
                        value={newProducerWorkplace}
                        onChange={(e) => setNewProducerWorkplace(e.target.value)}
                        className="mt-1" 
                        placeholder="نام دقیق قسمت در خواست دهنده استودیو را بنویسید"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="producerUsername">نام کاربری *</Label>
                      <Input 
                        type="text" 
                        id="producerUsername"
                        value={newProducerUsername}
                        onChange={(e) => setNewProducerUsername(e.target.value)}
                        className="mt-1" 
                        placeholder="برای ورود به سیستم"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="producerPassword">رمز عبور *</Label>
                      <Input 
                        type="password" 
                        id="producerPassword" 
                        value={newProducerPassword}
                        onChange={(e) => setNewProducerPassword(e.target.value)}
                        className="mt-1" 
                        placeholder="یک رمز عبور قوی انتخاب کنید"
                        required
                      />
                    </div>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      افزودن تهیه‌کننده <PlusSquare className="me-2 h-4 w-4"/>
                    </Button>
                  </form>
                   <p className="mt-4 text-xs text-muted-foreground">
                    این بخش برای افزودن تهیه‌کنندگان طراحی شده و قابلیت توسعه برای تنظیمات بیشتر را دارد.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

