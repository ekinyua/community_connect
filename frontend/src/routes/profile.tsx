// src/routes/profile.tsx
import { createFileRoute } from '@tanstack/react-router';
import ProfilePage from './profile/profileId'; 

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
});
