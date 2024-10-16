import { createFileRoute } from '@tanstack/react-router'
// import CurrentUserProfile from '../components/CurrentUserProfile'
import UserProfile from '../components/UserProfile'

export const UserProfileRoute = createFileRoute('/profile')({
  component: UserProfile,
})

// Changed to use CurrentUserProfile component
export const Route = createFileRoute('/profile')({
  component: UserProfile,
})
