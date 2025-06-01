'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import { Loader2, UploadCloud, XCircle } from 'lucide-react';

export function ProfilePictureUpload() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          title: 'خطا در آپلود',
          description: 'حجم فایل نباید بیشتر از 2 مگابایت باشد.',
          variant: 'destructive',
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setIsLoading(true);
        // Simulate upload delay
        setTimeout(() => {
          if (updateProfile) {
            updateProfile({ profilePictureUrl: base64String });
            toast({
              title: 'تصویر پروفایل به‌روزرسانی شد',
              description: 'تصویر پروفایل شما با موفقیت آپلود شد.',
            });
          }
          setIsLoading(false);
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePicture = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (updateProfile) {
        updateProfile({ profilePictureUrl: undefined });
        toast({
          title: 'تصویر پروفایل حذف شد',
          description: 'تصویر پروفایل شما با موفقیت حذف شد.',
        });
      }
      setIsLoading(false);
    }, 500);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg shadow-sm bg-card">
      <Avatar className="h-40 w-40 border-2 border-primary">
        <AvatarImage src={user?.profilePictureUrl || '/placeholder-avatar.png'} alt="Profile Picture" />
        <AvatarFallback>{user?.name ? user.name.charAt(0) : '?'}</AvatarFallback>
      </Avatar>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/jpg"
        disabled={isLoading}
      />
      <div className="flex space-x-2 rtl:space-x-reverse">
        <Button onClick={triggerFileInput} disabled={isLoading}>
          {isLoading ? <Loader2 className="ms-2 h-4 w-4 animate-spin" /> : <UploadCloud className="ms-2 h-4 w-4" />}
          {user?.profilePictureUrl ? 'تغییر تصویر' : 'آپلود تصویر'}
        </Button>
        {user?.profilePictureUrl && (
          <Button variant="outline" onClick={handleRemovePicture} disabled={isLoading}>
            {isLoading ? <Loader2 className="ms-2 h-4 w-4 animate-spin" /> : <XCircle className="ms-2 h-4 w-4" />}
            حذف تصویر
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">فایل‌های JPG، JPEG، PNG (حداکثر 2 مگابایت)</p>
    </div>
  );
}
