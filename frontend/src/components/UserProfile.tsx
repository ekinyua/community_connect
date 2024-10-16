import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from '@tanstack/react-router';
import { AppDispatch, RootState } from '@/services/store';
import { fetchUserProfile, clearViewedProfile } from '@/services/slices/profileSlice';
import ProfileDisplay from './ProfileDisplay';
import { Card, CardContent } from '@/components/ui/card';

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

  return <ProfileDisplay profile={viewedProfile} />;
};

export default UserProfile;