
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UserCog, Users, ListChecks, PlusSquare, ArrowRight, Edit3, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input'; // ShadCN Input
import { Label } from '@/components/ui/label'; // ShadCN Label
import React, { useState, FormEvent } from 'react';
import type { Producer } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function AdminPanelPage() {
  const { toast } = useToast();
  const [producers, setProducers] = useState<Producer[]>([]);
  
  const [newProducerName, setNewProducerName] = useState('');
  const [newProducerWorkplace, setNewProducerWorkplace] = useState('');
  const [newProducerUsername, setNewProducerUsername] = useState('');
  const [newProducerPassword, setNewProducerPassword] = useState('');

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
      id: Date.now().toString(), // Simple ID generation for client-side
      name: newProducerName,
      workplace: newProducerWorkplace,
      username: newProducerUsername,
      // In a real app, password would be hashed and not stored like this
    };
    setProducers(prevProducers => [...prevProducers, newProducer]);
    
    // Clear form fields
    setNewProducerName('');
    setNewProducerWorkplace('');
    setNewProducerUsername('');
    setNewProducerPassword('');

    toast({
      title: "موفقیت",
      description: `تهیه‌کننده "${newProducer.name}" با موفقیت اضافه شد.`,
    });
  };

  // Placeholder for delete producer function
  const handleDeleteProducer = (producerId: string) => {
    setProducers(prevProducers => prevProducers.filter(p => p.id !== producerId));
    toast({
      title: "موفقیت",
      description: "تهیه‌کننده با موفقیت حذف شد.",
      variant: "destructive"
    });
  }


  return (
    <div className="space-y-6">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/dashboard">
          <ArrowRight className="ms-2 h-4 w-4" /> بازگشت به داشبورد
        </Link>
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center">
            <UserCog className="ms-3 h-8 w-8 text-primary" />
            پنل مدیریت سیستم رزرواسیون
          </CardTitle>
          <CardDescription>مدیریت درخواست‌های رزرو، تهیه‌کنندگان و تنظیمات کلی سیستم.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="requests" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="requests"><ListChecks className="me-2 h-4 w-4"/> مدیریت درخواست‌ها</TabsTrigger>
              <TabsTrigger value="producers"><Users className="me-2 h-4 w-4"/> مدیریت تهیه‌کنندگان</TabsTrigger>
              <TabsTrigger value="add-producer"><PlusSquare className="me-2 h-4 w-4"/> افزودن تهیه‌کننده</TabsTrigger>
            </TabsList>
            
            <TabsContent value="requests">
              <Card>
                <CardHeader>
                  <CardTitle>درخواست‌های رزرو</CardTitle>
                  <CardDescription>مشاهده و مدیریت تمامی درخواست‌های ثبت شده توسط مهمانان و تهیه‌کنندگان.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Placeholder for request lists (New/Old) */}
                  <div className="p-6 border border-dashed rounded-lg bg-muted/30 min-h-[200px] flex items-center justify-center">
                    <p className="text-muted-foreground text-center">
                      لیست درخواست‌های جدید و خوانده شده در اینجا نمایش داده می‌شود. <br/>
                      امکان علامت‌گذاری به عنوان خوانده شده نیز فراهم خواهد شد.
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    درخواست‌های جدید بر اساس جدیدترین ابتدا مرتب می‌شوند. هر درخواست شامل تمامی اطلاعات فرم خواهد بود.
                  </p>
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
                              <Edit3 className="ms-1 h-4 w-4" /> ویرایش
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteProducer(producer.id)}>
                              <Trash2 className="ms-1 h-4 w-4" /> حذف
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
                      <PlusSquare className="ms-2 h-4 w-4"/> افزودن تهیه‌کننده
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
