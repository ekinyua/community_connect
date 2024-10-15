import { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createFileRoute } from '@tanstack/react-router';

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: Date;
}

export const Route = createFileRoute('/chats')({
  component: Chats,
});

export default function Chats() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'Alice',
      content: 'Hey, how are you?',
      timestamp: new Date('2023-10-15T10:00:00'),
    },
    {
      id: 2,
      sender: 'Bob',
      content: "I'm good, thanks! How about you?",
      timestamp: new Date('2023-10-15T10:01:00'),
    },
    {
      id: 3,
      sender: 'Alice',
      content: 'Doing well, thanks for asking!',
      timestamp: new Date('2023-10-15T10:02:00'),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const message: Message = {
      id: messages.length + 1,
      sender: 'You',
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <Card className="w-full max-w-screen-xl  h-screen mx-auto">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-4 ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`flex ${message.sender === 'You' ? 'flex-row-reverse' : 'flex-row'} items-start`}>
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.sender}`}
                    alt={message.sender}
                  />
                  <AvatarFallback>{message.sender[0]}</AvatarFallback>
                </Avatar>
                <div
                  className={`mx-2 ${message.sender === 'You' ? 'text-right' : 'text-left'}`}>
                  <div className="text-sm font-semibold">{message.sender}</div>
                  <div
                    className={`mt-1 p-2 rounded-lg ${message.sender === 'You' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {message.content}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex w-full max-w-screen-xl mx-auto gap-2 fixed bottom-0 left-1/2 transform -translate-x-1/2 p-4 bg-white">
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">Send</Button>
        </form>
      </CardFooter>
    </Card>
  );
}
