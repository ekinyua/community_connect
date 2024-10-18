// In UserProfile.tsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from '@tanstack/react-router';
import { AppDispatch, RootState } from '@/services/store';
import { fetchUserProfile, clearViewedProfile } from '@/services/slices/profileSlice';
import ProfileDisplay from './ProfileDisplay';
import AppointmentBooking from './AppointmentBooking';
import BookedAppointments from './BookedAppointments';
import RatingSystem from './RatingSystem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const UserProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useParams({ from: '/profile/$userId' });
  const { viewedProfile, isLoading, error } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    if (userId) {
      console.log('UserProfile: Fetching profile for user ID:', userId);
      dispatch(fetchUserProfile(userId));
    }
    return () => {
      dispatch(clearViewedProfile());
    };
  }, [dispatch, userId]);

  console.log('UserProfile: viewedProfile:', viewedProfile);

  if (isLoading) return <Card><CardContent>Loading profile...</CardContent></Card>;
  if (error) return <Card><CardContent>Error: {error}</CardContent></Card>;
  if (!viewedProfile) return <Card><CardContent>No profile found for user ID: {userId}</CardContent></Card>;

  return (
    <div className="space-y-4 max-w-4xl mx-auto p-4">
      <Button asChild className="mb-4">
        <Link to="/">Back to Landing Page</Link>
      </Button>
      <ProfileDisplay profile={viewedProfile} />
      <Card>
        <CardHeader>
          <CardTitle>Book an Appointment</CardTitle>
        </CardHeader>
        <CardContent>
        <AppointmentBooking serviceProviderId={viewedProfile.user._id} availability={viewedProfile.availability} />
        <BookedAppointments />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <RatingSystem userId={userId} />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;