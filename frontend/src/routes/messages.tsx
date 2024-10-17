import { createFileRoute } from '@tanstack/react-router'
import MessageList from '@/components/MessageList'

export const Route = createFileRoute('/messages')({
  component: MessageList,
})
