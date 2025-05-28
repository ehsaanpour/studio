'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2, ListChecks, PlusCircle, Trash2, CheckSquare, TextCursorInput, Hash, Mail, CalendarDays } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAiAssistedQuestionSuggestions, getAiGeneratedValidationRules } from '@/app/actions/ai.actions';
import type { FormFieldSuggestion, FormFieldDefinition } from '@/types';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fieldTypeIcons: { [key: string]: React.ElementType } = {
  text: TextCursorInput,
  email: Mail,
  number: Hash,
  date: CalendarDays,
  boolean: CheckSquare,
  default: ListChecks,
};

export function CreateFormClient() {
  const [formName, setFormName] = useState('');
  const [formContext, setFormContext] = useState('');
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [validationRules, setValidationRules] = useState<Record<string, string[]>>({});
  const [isSuggestingQuestions, setIsSuggestingQuestions] = useState(false);
  const [isGeneratingRules, setIsGeneratingRules] = useState(false);
  const { toast } = useToast();

  const [formFields, setFormFields] = useState<FormFieldDefinition[]>([]);

  const handleSuggestQuestions = async () => {
    if (!formContext) {
      toast({ title: 'خطا', description: 'لطفاً زمینه فرم را ارائه دهید.', variant: 'destructive' });
      return;
    }
    setIsSuggestingQuestions(true);
    try {
      const result = await getAiAssistedQuestionSuggestions({ formContext });
      setSuggestedQuestions(result.suggestedQuestionTypes);
      toast({ title: 'پیشنهادات هوش مصنوعی', description: 'انواع سوالات با موفقیت پیشنهاد شد!' });
    } catch (error) {
      console.error(error);
      toast({ title: 'خطا', description: 'دریافت پیشنهادات هوش مصنوعی ناموفق بود.', variant: 'destructive' });
    } finally {
      setIsSuggestingQuestions(false);
    }
  };

  const handleGenerateRules = async () => {
    if (!formContext) {
      toast({ title: 'خطا', description: 'لطفاً زمینه فرم را ارائه دهید.', variant: 'destructive' });
      return;
    }
    setIsGeneratingRules(true);
    try {
      const result = await getAiGeneratedValidationRules({ formContext });
      setValidationRules(result.validationRules);
      toast({ title: 'قوانین اعتبارسنجی هوش مصنوعی', description: 'قوانین اعتبارسنجی با موفقیت تولید شد!' });
    } catch (error) {
      console.error(error);
      toast({ title: 'خطا', description: 'تولید قوانین اعتبارسنجی ناموفق بود.', variant: 'destructive' });
    } finally {
      setIsGeneratingRules(false);
    }
  };

  const addField = () => {
    setFormFields([...formFields, { id: Date.now().toString(), label: '', type: 'text', placeholder: '', required: false }]);
  };

  const updateField = (id: string, updates: Partial<FormFieldDefinition>) => {
    setFormFields(formFields.map(field => field.id === id ? { ...field, ...updates } : field));
  };

  const removeField = (id: string) => {
    setFormFields(formFields.filter(field => field.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <Label htmlFor="formName" className="text-lg">نام فرم</Label>
          <Input 
            id="formName" 
            placeholder="مثال: نظرسنجی رضایت مشتری" 
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="mt-1 text-base"
          />
        </div>
        <div>
          <Label htmlFor="formContext" className="text-lg">زمینه فرم</Label>
          <Textarea
            id="formContext"
            placeholder="هدف فرم خود، اینکه چه کسی آن را پر می‌کند و چه اطلاعاتی را باید جمع‌آوری کنید، شرح دهید. برای مثال: 'یک فرم بازخورد برای کاربرانی که خریدی را در وب‌سایت تجارت الکترونیک ما انجام داده‌اند. ما می‌خواهیم رضایت آن‌ها از محصول و فرآیند ارسال را بدانیم.'"
            value={formContext}
            onChange={(e) => setFormContext(e.target.value)}
            rows={5}
            className="mt-1 text-base"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleSuggestQuestions} disabled={isSuggestingQuestions || !formContext} className="w-full sm:w-auto">
          {isSuggestingQuestions ? <Loader2 className="ms-2 h-4 w-4 animate-spin" /> : <Wand2 className="ms-2 h-4 w-4" />}
          پیشنهاد هوش مصنوعی برای انواع سوالات
        </Button>
        <Button onClick={handleGenerateRules} disabled={isGeneratingRules || !formContext} className="w-full sm:w-auto">
          {isGeneratingRules ? <Loader2 className="ms-2 h-4 w-4 animate-spin" /> : <ListChecks className="ms-2 h-4 w-4" />}
          تولید هوش مصنوعی قوانین اعتبارسنجی
        </Button>
      </div>

      {suggestedQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><Wand2 className="ms-2 h-5 w-5 text-primary" /> انواع سوالات پیشنهادی هوش مصنوعی</CardTitle>
            <CardDescription>این انواع سوالات را برای فرم خود بر اساس زمینه‌ای که ارائه دادید در نظر بگیرید.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ps-5">
              {suggestedQuestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {Object.keys(validationRules).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><ListChecks className="ms-2 h-5 w-5 text-primary" /> قوانین اعتبارسنجی تولید شده توسط هوش مصنوعی</CardTitle>
            <CardDescription>قوانین اعتبارسنجی بالقوه برای فیلدها بر اساس زمینه فرم شما. اینها را در فیلدهای زیر اعمال کنید.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(validationRules).map(([field, rules]) => (
              <div key={field}>
                <h4 className="font-semibold text-sm">{field}:</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {rules.map((rule, index) => (
                    <Badge key={index} variant="secondary">{rule}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">فیلدهای فرم</CardTitle>
          <CardDescription>فیلدهای فرم خود را اضافه و پیکربندی کنید.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {formFields.map((field, index) => {
            const FieldIcon = fieldTypeIcons[field.type] || fieldTypeIcons.default;
            return (
              <Card key={field.id} className="p-4 bg-muted/30 relative group">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 end-2 opacity-50 group-hover:opacity-100 text-destructive hover:bg-destructive/10"
                  onClick={() => removeField(field.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div>
                    <Label htmlFor={`field-label-${field.id}`}>برچسب فیلد</Label>
                    <Input
                      id={`field-label-${field.id}`}
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      placeholder="مثال: نام شما"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`field-type-${field.id}`}>نوع فیلد</Label>
                    <Select
                      value={field.type}
                      onValueChange={(value) => updateField(field.id, { type: value as FormFieldSuggestion['type'] })}
                    >
                      <SelectTrigger id={`field-type-${field.id}`} className="w-full mt-1">
                        <div className="flex items-center gap-2">
                          <FieldIcon className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="انتخاب نوع" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text"><TextCursorInput className="h-4 w-4 me-2 inline-block"/> متن</SelectItem>
                        <SelectItem value="email"><Mail className="h-4 w-4 me-2 inline-block"/> ایمیل</SelectItem>
                        <SelectItem value="number"><Hash className="h-4 w-4 me-2 inline-block"/> عدد</SelectItem>
                        <SelectItem value="date"><CalendarDays className="h-4 w-4 me-2 inline-block"/> تاریخ</SelectItem>
                        <SelectItem value="textarea">ناحیه متنی</SelectItem>
                        <SelectItem value="select">انتخابی</SelectItem>
                        <SelectItem value="checkbox"><CheckSquare className="h-4 w-4 me-2 inline-block"/> چک‌باکس</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor={`field-placeholder-${field.id}`}>متن جایگزین (اختیاری)</Label>
                    <Input
                      id={`field-placeholder-${field.id}`}
                      value={field.placeholder || ''}
                      onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                      placeholder="مثال: رضا رضایی"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center space-x-2 md:col-span-2 rtl:space-x-reverse">
                    <input
                      type="checkbox"
                      id={`field-required-${field.id}`}
                      checked={field.required}
                      onChange={(e) => updateField(field.id, { required: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor={`field-required-${field.id}`} className="text-sm font-medium">
                      ضروری
                    </Label>
                  </div>
                </div>
                 {validationRules[field.label] && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1">اعتبارسنجی‌های پیشنهادی هوش مصنوعی برای "{field.label}":</p>
                    <div className="flex flex-wrap gap-1">
                      {validationRules[field.label].map((rule, idx) => (
                        <Badge key={idx} variant="outline">{rule}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
          <Button variant="outline" onClick={addField} className="w-full border-dashed hover:border-solid">
            <PlusCircle className="ms-2 h-4 w-4" /> افزودن فیلد
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-3 mt-8 rtl:space-x-reverse">
        <Button variant="outline">ذخیره پیش‌نویس</Button>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">ایجاد فرم</Button>
      </div>
    </div>
  );
}
