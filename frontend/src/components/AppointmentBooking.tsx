import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/services/store';
import { bookAppointment } from '@/services/slices/bookingSlice';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface AppointmentBookingProps {
  userId: string;
  availability: Array<{ day: string; startTime: string; endTime: string }>;
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ userId, availability }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      dispatch(bookAppointment({
        serviceProvider: userId,
        date: selectedDate.toISOString().split('T')[0],
        startTime: selectedTime,
        endTime: selectedTime,
        service: 'Default Service',
        consumer: 'Current User ID', // from auth state
        status: 'pending'
      }));
    }
  };

  const availableTimes = availability.find(a => a.day === selectedDate?.toLocaleDateString('en-US', { weekday: 'long' }));

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        disabled={(date) => 
          !availability.some(a => a.day === date.toLocaleDateString('en-US', { weekday: 'long' }))
        }
      />
      {selectedDate && availableTimes && (
        <Select onValueChange={setSelectedTime}>
          <SelectTrigger>
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 24 }, (_, i) => i).map(hour => {
              const time = `${hour.toString().padStart(2, '0')}:00`;
              if (time >= availableTimes.startTime && time < availableTimes.endTime) {
                return <SelectItem key={time} value={time}>{time}</SelectItem>;
              }
              return null;
            })}
          </SelectContent>
        </Select>
      )}
      <Button onClick={handleBooking} disabled={!selectedDate || !selectedTime}>Book Appointment</Button>
    </div>
  );
};

export default AppointmentBooking;