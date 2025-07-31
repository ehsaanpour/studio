"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Engineer, StudioReservationRequest } from "@/types";
import { Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns-jalali';
import faIR from 'date-fns-jalali/locale/fa-IR';

export default function EngineerAssignmentClient() {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [reservations, setReservations] = useState<StudioReservationRequest[]>([]);
  const [newEngineerName, setNewEngineerName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEngineers, setSelectedEngineers] = useState<{ [key: string]: string[] }>({});
  const [engineerCounts, setEngineerCounts] = useState<{ [key: string]: number }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  async function fetchData() {
    try {
      setIsLoading(true);
      const [engineersRes, reservationsRes] = await Promise.all([
        fetch("/api/engineer/list", { cache: "no-store" }),
        fetch("/api/reservations", { cache: "no-store" }),
      ]);
      if (!engineersRes.ok) throw new Error("Failed to fetch engineers");
      if (!reservationsRes.ok) throw new Error("Failed to fetch reservations");
      const engineersData = await engineersRes.json();
      const reservationsData = await reservationsRes.json();
      setEngineers(engineersData);
      setReservations(reservationsData);
      const initialSelections: { [key: string]: string[] } = {};
      const initialCounts: { [key: string]: number } = {};
      reservationsData.forEach((res: StudioReservationRequest) => {
        const count = res.engineerCount || (res.engineers && res.engineers.length > 0 ? res.engineers.length : 1);
        initialCounts[res.id] = count;
        const currentEngineers = res.engineers || [];
        initialSelections[res.id] = [...currentEngineers, ...Array(Math.max(0, count - currentEngineers.length)).fill('')];
      });
      setEngineerCounts(initialCounts);
      setSelectedEngineers(initialSelections);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleAddEngineer() {
    if (!newEngineerName.trim()) return;
    try {
      const response = await fetch("/api/engineer/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newEngineerName }),
      });
      if (!response.ok) throw new Error("Failed to add engineer");
      setNewEngineerName("");
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  }

  async function handleRemoveReservation(id: string) {
    if (!confirm('آیا از حذف این برنامه مطمئن هستید؟')) return;
    try {
      const response = await fetch(`/api/reservations/delete`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
      if (!response.ok) throw new Error("Failed to remove reservation");
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  }

  async function handleRemoveAllReservations() {
    if (!confirm('آیا از حذف تمام برنامه‌ها مطمئن هستید؟ این عمل قابل بازگشت نیست.')) return;
    try {
      const response = await fetch(`/api/reservations/delete-all`, { 
        method: 'POST',
      });
      if (!response.ok) throw new Error("Failed to remove all reservations");
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  }

  async function handleRemoveEngineer(id: string) {
    try {
      const response = await fetch("/api/engineer/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("Failed to remove engineer");
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  }
  
  async function handleAssignEngineers(reservationId: string, engineerIds: string[], engineerCount: number) {
    try {
      const response = await fetch('/api/reservations/assign-engineer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId, engineerIds, engineerCount }),
      });
      if (!response.ok) {
        throw new Error('Failed to assign engineer');
      }
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  }

  const confirmedReservations = reservations.filter(reservation => reservation.status === 'confirmed');
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = confirmedReservations.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-4" dir="rtl">
      <h1 className="text-2xl font-bold">پنل اختصاص مهندس</h1>

      <Card>
        <CardHeader>
          <CardTitle>مدیریت مهندسین</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Label htmlFor="new-engineer-name" className="sr-only">نام مهندس</Label>
            <Input
              id="new-engineer-name"
              value={newEngineerName}
              onChange={(e) => setNewEngineerName(e.target.value)}
              placeholder="نام مهندس جدید را وارد کنید"
            />
            <Button onClick={handleAddEngineer}>افزودن</Button>
          </div>
          {isLoading && <p>در حال بارگذاری مهندسین...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <ul className="space-y-2">
            {engineers.map((engineer) => (
              <li key={engineer.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                <span>{engineer.name}</span>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveEngineer(engineer.id)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">حذف</span>
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
          <CardTitle>برنامه‌های ثبت شده</CardTitle>
          <Button variant="destructive" size="sm" onClick={handleRemoveAllReservations}>حذف همه</Button>
        </div>
        </CardHeader>
        <CardContent>
          {isLoading && <p>در حال بارگذاری برنامه‌ها...</p>}
          <ul className="space-y-4">
            {currentItems.map((reservation) => {
                const assignedEngineers = (reservation.engineers || [])
                    .map(id => engineers.find(e => e.id === id)?.name)
                    .filter(Boolean);

                return (
                    <li key={reservation.id} className="p-4 border rounded-md space-y-4 bg-card">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-grow">
                                <p className="font-semibold text-lg text-primary">{reservation.programName}</p>
                                <p className="text-sm text-muted-foreground">تهیه‌کننده: {reservation.requesterName}</p>
                                <p className="text-sm text-muted-foreground">تاریخ: {format(new Date(reservation.dateTime.reservationDate), 'EEEE, yyyy/MM/dd', { locale: faIR })}</p>
                                <p className="text-sm text-muted-foreground">ساعت: {reservation.dateTime.startTime} - {reservation.dateTime.endTime}</p>
                                <div className="flex items-center gap-2 mt-2"><Label>تعداد مهندس</Label><Select value={String(engineerCounts[reservation.id] || 1)} onValueChange={(value) => { const count = parseInt(value, 10); setEngineerCounts(prev => ({ ...prev, [reservation.id]: count })); setSelectedEngineers(prev => { const currentSelection = prev[reservation.id] || []; const newSelection = Array(count).fill('').map((_, i) => currentSelection[i] || ''); return { ...prev, [reservation.id]: newSelection }; }); }}><SelectTrigger className="w-[80px]"><SelectValue /></SelectTrigger><SelectContent>{[1, 2, 3, 4].map(num => (<SelectItem key={num} value={String(num)}>{num}</SelectItem>))}</SelectContent></Select></div>
                                {assignedEngineers.length > 0 && 
                                    <p className="text-sm font-medium text-green-600 dark:text-green-400">مهندسین فعلی: {assignedEngineers.join(', ')}</p>
                                }
                            </div>
                            <div className="flex flex-col gap-2 w-56">
                                {Array.from({ length: engineerCounts[reservation.id] || 1 }).map((_, index) => (
                                    <Select
                                        key={index}
                                        onValueChange={(engineerId) => {
                                            const newSelections = { ...selectedEngineers };
                                            if (!newSelections[reservation.id]) {
                                                newSelections[reservation.id] = Array(engineerCounts[reservation.id] || 1).fill('');
                                            }
                                            newSelections[reservation.id][index] = engineerId;
                                            setSelectedEngineers(newSelections);
                                        }}
                                        value={selectedEngineers[reservation.id]?.[index] || ''}
                                        dir="rtl"
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={`مهندس ${index + 1}`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {engineers.map((engineer) => (
                                                <SelectItem key={engineer.id} value={engineer.id}>
                                                    {engineer.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ))}
                                <div className="flex gap-2 mt-2">
                                    <Button className="flex-1" onClick={() => handleAssignEngineers(reservation.id, selectedEngineers[reservation.id]?.filter(id => id) || [], engineerCounts[reservation.id] || 1)}>
                                        ثبت
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => handleRemoveReservation(reservation.id)}>
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">حذف</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </li>
                );
            })}
          </ul>
          <div className="flex justify-center items-center space-x-2 mt-4">
            {Array.from({ length: Math.ceil(confirmedReservations.length / itemsPerPage) }, (_, i) => (
              <Button key={i + 1} onClick={() => paginate(i + 1)} variant={currentPage === i + 1 ? "default" : "outline"}>
                {i + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

