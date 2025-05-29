
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, SettingsIcon, UserPlus, KeyRound, LockKeyhole } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState, FormEvent } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { toast } = useToast();

  // State for Add New Admin form
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');

  // State for Change Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleAddAdminSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newAdminName || !newAdminUsername || !newAdminPassword) {
      toast({
        title: "خطا",
        description: "لطفاً تمامی فیلدهای مربوط به افزودن ادمین را تکمیل کنید.",
        variant: "destructive",
      });
      return;
    }
    // Mock adding admin
    console.log('Adding new admin:', { name: newAdminName, username: newAdminUsername, password: newAdminPassword });
    toast({
      title: "موفقیت",
      description: `ادمین "${newAdminName}" (نام کاربری: ${newAdminUsername}) با موفقیت (به صورت شبیه‌سازی شده) اضافه شد.`,
    });
    setNewAdminName('');
    setNewAdminUsername('');
    setNewAdminPassword('');
  };

  const handleChangePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast({
        title: "خطا",
        description: "لطفاً تمامی فیلدهای مربوط به تغییر رمز عبور را تکمیل کنید.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "خطا",
        description: "رمز عبور جدید و تکرار آن مطابقت ندارند.",
        variant: "destructive",
      });
      return;
    }
    // Mock changing password
    console.log('Changing password for current admin.');
    toast({
      title: "موفقیت",
      description: "رمز عبور با موفقیت (به صورت شبیه‌سازی شده) تغییر کرد.",
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

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
            <SettingsIcon className="ms-3 h-8 w-8 text-primary" />
            تنظیمات سیستم
          </CardTitle>
          <CardDescription>مدیریت تنظیمات ادمین‌ها و سایر موارد.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="add-admin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="add-admin">
                <UserPlus className="ms-2 h-4 w-4" /> افزودن ادمین جدید
              </TabsTrigger>
              <TabsTrigger value="change-password">
                <LockKeyhole className="ms-2 h-4 w-4" /> تغییر رمز عبور
              </TabsTrigger>
            </TabsList>

            <TabsContent value="add-admin">
              <Card>
                <CardHeader>
                  <CardTitle>افزودن ادمین جدید</CardTitle>
                  <CardDescription>برای افزودن یک ادمین جدید به سیستم، فرم زیر را تکمیل کنید.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddAdminSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="newAdminName">نام کامل *</Label>
                      <Input
                        type="text"
                        id="newAdminName"
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        className="mt-1"
                        placeholder="نام کامل ادمین"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="newAdminUsername">نام کاربری *</Label>
                      <Input
                        type="text"
                        id="newAdminUsername"
                        value={newAdminUsername}
                        onChange={(e) => setNewAdminUsername(e.target.value)}
                        className="mt-1"
                        placeholder="برای ورود به سیستم"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="newAdminPassword">رمز عبور *</Label>
                      <Input
                        type="password"
                        id="newAdminPassword"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        className="mt-1"
                        placeholder="یک رمز عبور قوی انتخاب کنید"
                        required
                      />
                    </div>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      افزودن ادمین <UserPlus className="me-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="change-password">
              <Card>
                <CardHeader>
                  <CardTitle>تغییر رمز عبور</CardTitle>
                  <CardDescription>برای تغییر رمز عبور فعلی خود، فرم زیر را تکمیل کنید.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">رمز عبور فعلی *</Label>
                      <Input
                        type="password"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="mt-1"
                        placeholder="رمز عبور فعلی خود را وارد کنید"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">رمز عبور جدید *</Label>
                      <Input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1"
                        placeholder="رمز عبور جدید را وارد کنید"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmNewPassword">تکرار رمز عبور جدید *</Label>
                      <Input
                        type="password"
                        id="confirmNewPassword"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="mt-1"
                        placeholder="رمز عبور جدید را مجدداً وارد کنید"
                        required
                      />
                    </div>
                    <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      تغییر رمز عبور <KeyRound className="me-2 h-4 w-4" />
                    </Button>
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
