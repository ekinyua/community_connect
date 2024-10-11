import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { profileApi } from '@/services/api';
import { useNavigate, useParams } from '@tanstack/react-router';

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await profileApi.getProfile(userId);
        setProfile(profileData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        if (err instanceof Error && err.message.includes('401')) {
          navigate({ to: '/login' });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      {profile && (
        <div>
          <p>Username: {profile.user.username}</p>
          <p>Email: {profile.user.email}</p>
          <p>User Type: {profile.user.userType}</p>
          <p>Bio: {profile.bio}</p>
          <p>Location: {profile.location}</p>
          <p>
            Profile Picture: <img src={profile.profilePicture} alt="Profile" />
          </p>
          {/* Add more profile fields as necessary */}
        </div>
      )}
    </div>
  );
}
