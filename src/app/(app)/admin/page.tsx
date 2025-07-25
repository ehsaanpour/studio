'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UserCog, Users, ListChecks, PlusSquare, ArrowRight, Edit3, Trash2, CheckCircle, XCircle, Inbox, MailOpen, Check, ShieldCheck, ThumbsUp, ThumbsDown, Repeat } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState, FormEvent, useEffect } from 'react';
import type { Producer, StudioReservationRequest, AdditionalService, CateringService, Repetition } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { getReservations, updateReservationStatus } from '@/lib/reservation-store';
import { format } from 'date-fns-jalali';
import faIR from 'date-fns-jalali/locale/fa-IR';
import { Badge } from '@/components/ui/badge';
import { addProducer, getAllProducers, deleteProducer, updateProducer } from '@/lib/producer-store';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

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
  xdcam: 'XDCAM',
  crane: 'کرین',
  makeup_artist: 'گریمور',
  service_staff: 'نیروی خدمات',
  live_communication: 'ارتباط زنده',
  stream: 'استریم',
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

const getRepetitionLabel = (repetition: Repetition | undefined): string => {
  if (!repetition) return '';
  switch (repetition.type) {
    case 'weekly_1month': return 'هفتگی (یک ماه)';
    case 'weekly_3months': return 'هفتگی (سه ماه)';
    case 'daily_until_date': return 'روزانه';
    default: return '';
  }
};

const getStatusLabel = (status: StudioReservationRequest['status']): string => {
  switch (status) {
    case 'new': return 'جدید';
    case 'read': return 'خوانده شده';
    case 'confirmed': return 'تایید شده';
    case 'cancelled': return 'رد شده';
    default: return status;
  }
};

const getStatusBadgeVariant = (status: StudioReservationRequest['status']): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'new': return 'destructive';
    case 'read': return 'secondary';
    case 'confirmed': return 'default'; // Uses primary color, good for positive
    case 'cancelled': return 'outline';
    default: return 'secondary';
  }
};

export default function AdminPanelPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [producers, setProducers] = useState<Producer[]>([]);
  const [allRequests, setAllRequests] = useState<StudioReservationRequest[]>([]);
  
  const [newProducerName, setNewProducerName] = useState('');
  const [newProducerWorkplace, setNewProducerWorkplace] = useState('');
  const [newProducerUsername, setNewProducerUsername] = useState('');
  const [newProducerPassword, setNewProducerPassword] = useState('');
  const [newProducerEmail, setNewProducerEmail] = useState('');
  const [newProducerPhone, setNewProducerPhone] = useState('');

  // Add state for editing
  const [editingProducer, setEditingProducer] = useState<Producer | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Add state for active tab
  const [activeTab, setActiveTab] = useState('requests');

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin');
      return;
    }
    async function loadRequests() {
      const requests = await getReservations();
      setAllRequests(requests);
    }
    loadRequests();

    // Load producers from Firestore
    const loadProducers = async () => {
      try {
        const producersList = await getAllProducers();
        setProducers(producersList);
      } catch (error) {
        console.error('Error loading producers:', error);
        toast({
          title: "خطا",
          description: "خطا در بارگذاری لیست تهیه‌کنندگان.",
          variant: "destructive",
        });
      }
    };
    loadProducers();

    return () => {}; // No longer need to unsubscribe from a non-existent subscription
  }, [isAdmin, router, toast]);

  const newSystemRequests = allRequests.filter(req => req.status === 'new' || req.status === 'read');
  const finalizedSystemRequests = allRequests.filter(req => req.status === 'confirmed');
  const rejectedSystemRequests = allRequests.filter(req => req.status === 'cancelled');


  const handleAddProducer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newProducerName || !newProducerUsername || !newProducerPassword || !newProducerPhone) {
      toast({
        title: "خطا",
        description: "لطفاً تمامی فیلدهای ستاره‌دار را تکمیل کنید.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addProducer({
        name: newProducerName,
        username: newProducerUsername,
        password: newProducerPassword,
        email: newProducerEmail,
        phone: newProducerPhone,
        isAdmin: false,
      });
      
      toast({
        title: "موفقیت",
        description: `تهیه‌کننده "${newProducerName}" با موفقیت اضافه شد.`,
      });
      
      // Clear form and editing state
      setNewProducerName('');
      setNewProducerUsername('');
      setNewProducerPassword('');
      setNewProducerEmail('');
      setNewProducerPhone('');
      setNewProducerWorkplace('');

      // Optionally switch back to producers list after adding
      setActiveTab('producers');
      
      // Reload producers
      const producersList = await getAllProducers();
      setProducers(producersList);
    } catch (error) {
      console.error('Error adding producer:', error);
      toast({
        title: "خطا",
        description: "خطا در افزودن تهیه‌کننده. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProducer = async (producerId: string) => {
    try {
      await deleteProducer(producerId);
      const producersList = await getAllProducers();
      setProducers(producersList);
      toast({
        title: "موفقیت",
        description: "تهیه‌کننده با موفقیت حذف شد.",
      });
    } catch (error) {
      console.error('Error deleting producer:', error);
      toast({
        title: "خطا",
        description: "خطا در حذف تهیه‌کننده. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRequestStatus = async (requestId: string, status: StudioReservationRequest['status']) => {
    try {
      await updateReservationStatus(requestId, status);
      const requests = await getReservations();
      setAllRequests(requests);
      toast({
        title: "وضعیت بروز شد",
        description: `درخواست به عنوان "${getStatusLabel(status)}" علامت‌گذاری شد.`,
      });
    } catch (error) {
      console.error(`Error updating status for request ${requestId}:`, error);
      toast({
        title: "خطا",
        description: "خطا در بروزرسانی وضعیت درخواست.",
        variant: "destructive",
      });
    }
  };

  const handleEditProducer = (producer: Producer) => {
    setEditingProducer(producer);
    setNewProducerName(producer.name);
    setNewProducerWorkplace(producer.workplace || '');
    setNewProducerUsername(producer.username);
    setNewProducerPassword(''); // Clear password for security
    setNewProducerEmail(producer.email || '');
    setNewProducerPhone(producer.phone || '');
    setIsEditing(true);
    // Switch to the add-producer tab
    setActiveTab('add-producer');
  };

  const handleUpdateProducer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingProducer || !newProducerName || !newProducerUsername || !newProducerPhone) {
      toast({
        title: "خطا",
        description: "لطفاً تمامی فیلدهای ستاره‌دار را تکمیل کنید.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateProducer(editingProducer.id, {
        name: newProducerName,
        username: newProducerUsername,
        email: newProducerEmail,
        phone: newProducerPhone,
        workplace: newProducerWorkplace,
        // Only update password if a new one is provided
        ...(newProducerPassword ? { password: newProducerPassword } : {}),
      });
      
      toast({
        title: "موفقیت",
        description: `تهیه‌کننده "${newProducerName}" با موفقیت بروزرسانی شد.`,
      });
      
      // Clear form and editing state
      setEditingProducer(null);
      setIsEditing(false);
      setNewProducerName('');
      setNewProducerUsername('');
      setNewProducerPassword('');
      setNewProducerEmail('');
      setNewProducerPhone('');
      setNewProducerWorkplace('');
      
      // Switch back to producers list after updating
      setActiveTab('producers');
      
      // Reload producers
      const producersList = await getAllProducers();
      setProducers(producersList);
    } catch (error) {
      console.error('Error updating producer:', error);
      toast({
        title: "خطا",
        description: "خطا در بروزرسانی تهیه‌کننده. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) {
    return null;
  }

  const renderRequestCard = (request: StudioReservationRequest) => (
    <Card key={request.id} className="shadow-sm mb-4" dir="rtl">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-right mb-2 text-primary flex items-center">
              {request.programName}
              {(request.repetition?.type === 'weekly_1month' || request.repetition?.type === 'weekly_3months') && (
                <Repeat className="mr-2 h-5 w-5 text-blue-500" />
              )}
            </h3>
            <CardTitle className="text-lg text-right">درخواست از: {request.requesterName || (request.type === 'guest' ? request.personalInfo?.nameOrOrganization : 'تهیه‌کننده نامشخص')}</CardTitle>
            <CardDescription className="text-right">
              تاریخ ثبت: {format(new Date(request.submittedAt), 'PPP p', { locale: faIR })} - نوع: {request.type === 'guest' ? 'مهمان' : 'تهیه‌کننده'}
            </CardDescription>
          </div>
          <Badge variant={getStatusBadgeVariant(request.status)}>
            {getStatusLabel(request.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-right">
        {request.repetition && request.repetition.type !== 'no_repetition' && (
          <div><strong>نوع تکرار:</strong> <Badge variant="outline">{getRepetitionLabel(request.repetition)}</Badge></div>
        )}
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
      {(request.status === 'new' || request.status === 'read') && (
        <CardFooter className="flex justify-end gap-2">
          <Button onClick={() => handleUpdateRequestStatus(request.id, 'confirmed')} size="sm" variant="default" className="bg-green-600 hover:bg-green-700 text-white">
            تایید <ThumbsUp className="me-2 h-4 w-4" /> 
          </Button>
          <Button onClick={() => handleUpdateRequestStatus(request.id, 'cancelled')} size="sm" variant="destructive">
            رد کردن <ThumbsDown className="me-2 h-4 w-4" />
          </Button>
          {request.status === 'new' && (
             <Button onClick={() => handleUpdateRequestStatus(request.id, 'read')} size="sm" variant="outline">
                علامت‌گذاری به عنوان خوانده شده <CheckCircle className="me-2 h-4 w-4" /> 
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );

  return (
    <div className="space-y-6">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/admin" className="flex items-center">
          <ArrowRight className="ms-2 h-4 w-4" /> بازگشت به پنل مدیریت
        </Link>
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center">
            <UserCog className="me-3 h-8 w-8 text-primary" /> پنل مدیریت سیستم رزرواسیون 
          </CardTitle>
          <CardDescription>مدیریت درخواست‌های رزرو، تهیه‌کنندگان و تنظیمات کلی سیستم.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="requests">مدیریت درخواست‌ها <ListChecks className="me-2 h-4 w-4"/></TabsTrigger>
              <TabsTrigger value="producers">مدیریت تهیه‌کنندگان <Users className="me-2 h-4 w-4"/></TabsTrigger>
              <TabsTrigger value="add-producer">افزودن تهیه‌کننده <PlusSquare className="me-2 h-4 w-4"/></TabsTrigger>
            </TabsList>
            
            <TabsContent value="requests">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">درخواست‌های رزرو</CardTitle>
                  <CardDescription className="text-right">مشاهده و مدیریت تمامی درخواست‌های ثبت شده.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4" dir="rtl">
                  <Tabs defaultValue="new-requests" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                      <TabsTrigger value="new-requests">
                        درخواست‌های در انتظار بررسی ({newSystemRequests.length}) <Inbox className="me-2 h-4 w-4" />
                      </TabsTrigger>
                      <TabsTrigger value="finalized-requests">
                         درخواست‌های نهایی شده ({finalizedSystemRequests.length}) <ShieldCheck className="me-2 h-4 w-4" />
                      </TabsTrigger>
                       <TabsTrigger value="rejected-requests">
                        درخواست‌های رد شده ({rejectedSystemRequests.length}) <XCircle className="me-2 h-4 w-4" />
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="new-requests">
                      {newSystemRequests.length === 0 ? (
                        <p className="text-muted-foreground py-4 text-center">هیچ درخواست در انتظار بررسی وجود ندارد.</p>
                      ) : (
                        newSystemRequests.map(req => renderRequestCard(req))
                      )}
                    </TabsContent>
                    <TabsContent value="finalized-requests">
                      {finalizedSystemRequests.length === 0 ? (
                         <p className="text-muted-foreground py-4 text-center">هیچ درخواست نهایی شده‌ای وجود ندارد.</p>
                      ) : (
                        finalizedSystemRequests.map(req => renderRequestCard(req))
                      )}
                    </TabsContent>
                    <TabsContent value="rejected-requests">
                      {rejectedSystemRequests.length === 0 ? (
                        <p className="text-muted-foreground py-4 text-center">هیچ درخواست رد شده‌ای وجود ندارد.</p>
                      ) : (
                        rejectedSystemRequests.map(req => renderRequestCard(req))
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="producers">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">لیست تهیه‌کنندگان</CardTitle>
                  <CardDescription className="text-right">مشاهده لیست تهیه‌کنندگان موجود و امکان ویرایش یا حذف آن‌ها.</CardDescription>
                </CardHeader>
                <CardContent>
                  {producers.length === 0 ? (
                    <div className="p-6 border border-dashed rounded-lg bg-muted/30 min-h-[150px] flex items-center justify-center" dir="rtl">
                      <p className="text-muted-foreground text-center">
                        هیچ تهیه‌کننده‌ای یافت نشد. برای افزودن، به تب "افزودن تهیه‌کننده" بروید.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4" dir="rtl">
                      {producers.map(producer => (
                        <Card key={producer.id} className="shadow-sm">
                          <CardHeader>
                            <CardTitle className="text-lg text-right">{producer.name}</CardTitle>
                            <CardDescription className="text-right">
                              {producer.workplace} (نام کاربری: {producer.username})
                              <br />
                              ایمیل: {producer.email} | تلفن: {producer.phone}
                            </CardDescription>
                          </CardHeader>
                          <CardFooter className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditProducer(producer)}
                            >
                              ویرایش <Edit3 className="me-1 h-4 w-4" /> 
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => handleDeleteProducer(producer.id)}
                            >
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
                  <CardTitle className="text-right">{isEditing ? 'ویرایش تهیه‌کننده' : 'افزودن تهیه‌کننده جدید'}</CardTitle>
                  <CardDescription className="text-right">
                    {isEditing 
                      ? 'برای ویرایش اطلاعات تهیه‌کننده، فرم زیر را تکمیل کنید.'
                      : 'برای افزودن یک تهیه‌کننده جدید به سیستم، فرم زیر را تکمیل کنید.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={isEditing ? handleUpdateProducer : handleAddProducer} className="space-y-4" dir="rtl">
                    <div>
                      <Label htmlFor="producerName" className="text-right">نام *</Label>
                      <Input 
                        type="text" 
                        id="producerName" 
                        value={newProducerName}
                        onChange={(e) => setNewProducerName(e.target.value)}
                        className="mt-1 text-right" 
                        placeholder="نام کامل تهیه‌کننده"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="producerWorkplace" className="text-right">محل کار *</Label>
                      <Input 
                        type="text" 
                        id="producerWorkplace" 
                        value={newProducerWorkplace}
                        onChange={(e) => setNewProducerWorkplace(e.target.value)}
                        className="mt-1 text-right" 
                        placeholder="نام دقیق قسمت در خواست دهنده استودیو را بنویسید"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="producerEmail" className="text-right">ایمیل</Label>
                      <Input 
                        type="email" 
                        id="producerEmail" 
                        value={newProducerEmail}
                        onChange={(e) => setNewProducerEmail(e.target.value)}
                        className="mt-1 text-right" 
                        placeholder="example@domain.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="producerPhone" className="text-right">شماره تماس *</Label>
                      <Input 
                        type="tel" 
                        id="producerPhone" 
                        value={newProducerPhone}
                        onChange={(e) => setNewProducerPhone(e.target.value)}
                        className="mt-1 text-right" 
                        placeholder="شماره تماس"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="producerUsername" className="text-right">نام کاربری *</Label>
                      <Input 
                        type="text" 
                        id="producerUsername" 
                        value={newProducerUsername}
                        onChange={(e) => setNewProducerUsername(e.target.value)}
                        className="mt-1 text-right" 
                        placeholder="برای ورود به سیستم"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="producerPassword" className="text-right">رمز عبور *</Label>
                      <Input 
                        type="password" 
                        id="producerPassword" 
                        value={newProducerPassword}
                        onChange={(e) => setNewProducerPassword(e.target.value)}
                        className="mt-1 text-right" 
                        placeholder="یک رمز عبور قوی انتخاب کنید"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        {isEditing ? 'بروزرسانی تهیه‌کننده' : 'افزودن تهیه‌کننده'} 
                        {isEditing ? <Edit3 className="me-2 h-4 w-4"/> : <PlusSquare className="me-2 h-4 w-4"/>}
                      </Button>
                      {isEditing && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setIsEditing(false);
                            setEditingProducer(null);
                            setNewProducerName('');
                            setNewProducerUsername('');
                            setNewProducerPassword('');
                            setNewProducerEmail('');
                            setNewProducerPhone('');
                            setNewProducerWorkplace('');
                          }}
                        >
                          انصراف
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
