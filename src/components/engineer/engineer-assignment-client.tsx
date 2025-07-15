"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Engineer, StudioReservationRequest } from "@/types";
import { Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type ShiftData = {
  engineerName: string;
  shifts: {
    under1Hour: number;
    between1And2Hours: number;
    between3And4Hours: number;
  };
};

export default function EngineerAssignmentClient() {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [reservations, setReservations] = useState<StudioReservationRequest[]>([]);
  const [newEngineerName, setNewEngineerName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    try {
      setIsLoading(true);
      const [engineersRes, reservationsRes] = await Promise.all([
        fetch("/api/engineer/list"),
        fetch("/api/reservations"),
      ]);
      if (!engineersRes.ok) throw new Error("Failed to fetch engineers");
      if (!reservationsRes.ok) throw new Error("Failed to fetch reservations");
      const engineersData = await engineersRes.json();
      const reservationsData = await reservationsRes.json();
      setEngineers(engineersData);
      setReservations(reservationsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const shiftData: ShiftData[] = useMemo(() => {
    const data = engineers.map(engineer => ({
      engineerName: engineer.name,
      shifts: {
        under1Hour: 0,
        between1And2Hours: 0,
        between3And4Hours: 0,
      }
    }));

    reservations.forEach(reservation => {
      if (!reservation.engineerId) return;

      const engineerIndex = engineers.findIndex(e => e.id === reservation.engineerId);
      if (engineerIndex === -1) return;
      
      const duration = reservation.studioServices?.hoursPerDay || 0;

      if (duration > 0 && duration < 1) {
        data[engineerIndex].shifts.under1Hour++;
      } else if (duration >= 1 && duration <= 2) {
        data[engineerIndex].shifts.between1And2Hours++;
      } else if (duration >= 3 && duration <= 4) {
        data[engineerIndex].shifts.between3And4Hours++;
      } else if (duration > 4) {
        data[engineerIndex].shifts.between3And4Hours += 2;
      }
    });

    return data;
  }, [engineers, reservations]);

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
  
  async function handleAssignEngineer(reservationId: string, engineerId: string) {
    try {
      const response = await fetch('/api/reservations/assign-engineer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId, engineerId }),
      });
      if (!response.ok) {
        throw new Error('Failed to assign engineer');
      }
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  }

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
          <CardTitle>برنامه‌های ثبت شده</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p>در حال بارگذاری برنامه‌ها...</p>}
          <ul className="space-y-4">
            {reservations.map((reservation) => {
              const assignedEngineer = engineers.find(e => e.id === reservation.engineerId);
              return (
                <li key={reservation.id} className="p-4 border rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{reservation.programName}</p>
                      <p className="text-sm text-gray-500">تهیه‌کننده: {reservation.requesterName}</p>
                      <p className="text-sm text-gray-500">تاریخ: {new Date(reservation.dateTime.reservationDate).toLocaleDateString('fa-IR')}</p>
                      <p className="text-sm text-gray-500">ساعت شروع: {reservation.dateTime.startTime}</p>
                      <p className="text-sm text-gray-500">ساعت پایان: {reservation.dateTime.endTime}</p>
                      <p className="text-sm text-blue-500">مدت زمان: {reservation.studioServices?.hoursPerDay || 0} ساعت</p>
                      {assignedEngineer && <p className="text-sm text-green-600">مهندس: {assignedEngineer.name}</p>}
                    </div>
                    <div className="w-48">
                      <Select
                        onValueChange={(engineerId) => handleAssignEngineer(reservation.id, engineerId)}
                        value={reservation.engineerId}
                        dir="rtl"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="یک مهندس انتخاب کنید" />
                        </SelectTrigger>
                        <SelectContent>
                          {engineers.map((engineer) => (
                            <SelectItem key={engineer.id} value={engineer.id}>
                              {engineer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>جدول شیفت مهندسین</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">نام مهندس</TableHead>
                <TableHead className="text-right">برنامه‌های زیر ۱ ساعت</TableHead>
                <TableHead className="text-right">برنامه‌های بین ۱ و ۲ ساعت</TableHead>
                <TableHead className="text-right">برنامه‌های بین ۳ و ۴ ساعت</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shiftData.map((row: ShiftData, index: number) => (
                <TableRow key={index}>
                  <TableCell className="text-right">{row.engineerName}</TableCell>
                  <TableCell className="text-right">{row.shifts.under1Hour}</TableCell>
                  <TableCell className="text-right">{row.shifts.between1And2Hours}</TableCell>
                  <TableCell className="text-right">{row.shifts.between3And4Hours}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
