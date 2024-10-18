import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/services/store';
import { fetchUserBookings } from '@/services/slices/bookingSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BookedAppointments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, isLoading, error } = useSelector((state: RootState) => state.booking);

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  if (isLoading) return <div>Loading bookings...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Booked Appointments</h2>
      {bookings.length === 0 ? (
        <p>No appointments booked yet.</p>
      ) : (
        bookings.map((booking) => (
          <Card key={booking._id} className="mb-4">
            <CardHeader>
              <CardTitle>{booking.service}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
              <p>Time: {booking.startTime} - {booking.endTime}</p>
              <p>Status: {booking.status}</p>
              {booking.notes && <p>Notes: {booking.notes}</p>}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default BookedAppointments;