import { createFileRoute } from '@tanstack/react-router'
import UserProfile from '../../components/UserProfile'

export const Route = createFileRoute('/profile/$userId')({
  component: UserProfile,
})
