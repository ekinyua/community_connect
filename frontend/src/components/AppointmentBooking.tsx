// In AppointmentBooking.tsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/services/store';
import {
  bookAppointment,
  fetchUserBookings,
} from '@/services/slices/bookingSlice';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

interface AppointmentBookingProps {
  serviceProviderId: string;
  availability: Array<{ day: string; startTime: string; endTime: string }>;
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  serviceProviderId,
  availability,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.auth.user?.user);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined
  );
  const [notes, setNotes] = useState('');

  const handleBooking = async () => {
    if (selectedDate && selectedTime && currentUser) {
      const bookingData = {
        serviceProvider: serviceProviderId,
        consumer: currentUser.id,
        date: selectedDate.toISOString().split('T')[0],
        startTime: selectedTime,
        endTime: selectedTime,
        service: 'Default Service',
        status: 'pending' as const,
        notes: notes,
      };

      try {
        await dispatch(bookAppointment(bookingData)).unwrap();
        toast({
          title: 'Appointment Booked',
          description: 'Your appointment has been successfully booked.',
        });
        // Refresh the bookings list
        dispatch(fetchUserBookings());
        // Reset the form
        setSelectedDate(undefined);
        setSelectedTime(undefined);
        setNotes('');
      } catch (error) {
        console.error('Booking error:', error);
        toast({
          title: 'Booking Error',
          description:
            'There was an error booking your appointment. Please try again.',
          variant: 'destructive',
        });
      }
    } else {
      // console.log('Incomplete booking information');
      // console.log('Selected Date:', selectedDate);
      // console.log('Selected Time:', selectedTime);
      // console.log('Current User:', currentUser);
      // console.log('Service Provider ID:', serviceProviderId);
      toast({
        title: 'Incomplete Information',
        description: 'Please select a date and time for your appointment.',
        variant: 'destructive',
      });
    }
  };

  const availableTimes = selectedDate
    ? availability.find(
        (a) =>
          a.day ===
          selectedDate.toLocaleDateString('en-US', { weekday: 'long' })
      )
    : null;

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => {
          setSelectedDate(date);
        }}
        disabled={(date) =>
          !availability.some(
            (a) =>
              a.day === date.toLocaleDateString('en-US', { weekday: 'long' })
          )
        }
      />
      {selectedDate && availableTimes && (
        <Select
          onValueChange={(time) => {
            setSelectedTime(time);
          }}>
          <SelectTrigger>
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 24 }, (_, i) => i).map((hour) => {
              const time = `${hour.toString().padStart(2, '0')}:00`;
              if (
                time >= availableTimes.startTime &&
                time < availableTimes.endTime
              ) {
                return (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                );
              }
              return null;
            })}
          </SelectContent>
        </Select>
      )}
      <Input
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <Button onClick={handleBooking} disabled={!selectedDate || !selectedTime}>
        Book Appointment
      </Button>
    </div>
  );
};

export default AppointmentBooking;
