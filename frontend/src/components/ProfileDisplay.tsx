// In ProfileDisplay.tsx
import React from 'react';
import { ProfileData } from '@/services/slices/profileSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileDisplayProps {
  profile: ProfileData;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ profile }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar className="w-20 h-20">
          <AvatarImage
            src={profile.profilePicture || '/default.png'}
            alt={profile.user?.username}
          />
          <AvatarFallback>
            {profile.user?.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-2xl">
            {profile.user?.username || 'Unknown'}'s Profile
          </CardTitle>
          <p className="text-muted-foreground">
            {profile.user?.userType || 'User'}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>
          <strong>Email:</strong>{' '}
          <span className={profile.user?.email ? '' : 'text-gray-400 italic'}>
            {profile.user?.email || 'Not provided'}
          </span>
        </p>
        <p>
          <strong>Bio:</strong>{' '}
          <span className={profile.bio ? '' : 'text-gray-400 italic'}>
            {profile.bio || 'No bio provided'}
          </span>
        </p>
        <p>
          <strong>Location:</strong>{' '}
          <span className={profile.location ? '' : 'text-gray-400 italic'}>
            {profile.location || 'Not specified'}
          </span>
        </p>
        <p>
          <strong>Services:</strong>{' '}
          <span
            className={profile.services?.length ? '' : 'text-gray-400 italic'}>
            {profile.services?.join(', ') || 'No services listed'}
          </span>
        </p>
        <p>
          <strong>Pricing:</strong>{' '}
          <span className={profile.pricing ? '' : 'text-gray-400 italic'}>
            {profile.pricing || 'Not specified'}
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default ProfileDisplay;
