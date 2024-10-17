import Chat from '@/components/Chat'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chat/$userId')({
  component: Chat,
})
