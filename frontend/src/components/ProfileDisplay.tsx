import React from 'react';
import { ProfileData } from '@/services/slices/profileSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileDisplayProps {
  profile: ProfileData;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ profile }) => {
  console.log('ProfileDisplay: Rendering profile:', profile);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{profile.user?.username || 'Unknown'}'s Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Email: {profile.user?.email || 'Not provided'}</p>
        <p>User Type: {profile.user?.userType || 'Not specified'}</p>
        <p>Bio: {profile.bio || 'No bio provided'}</p>
        <p>Location: {profile.location || 'Not specified'}</p>
        <p>Services: {profile.services?.join(', ') || 'No services listed'}</p>
        {/* Add more profile fields as needed */}
      </CardContent>
    </Card>
  );
};

export default ProfileDisplay;