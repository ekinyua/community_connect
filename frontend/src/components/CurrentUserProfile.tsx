import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/services/store';
import { fetchCurrentUserProfile } from '@/services/slices/profileSlice';
import ProfileDisplay from './ProfileDisplay';

const CurrentUserProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUserProfile, isLoading, error } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    dispatch(fetchCurrentUserProfile());
  }, [dispatch]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentUserProfile) return <div>No profile found</div>;

  return <ProfileDisplay profile={currentUserProfile} />;
};

export default CurrentUserProfile;