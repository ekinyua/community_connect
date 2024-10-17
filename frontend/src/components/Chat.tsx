import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from '@tanstack/react-router';
import { AppDispatch, RootState } from '@/services/store';
import { fetchMessages, sendMessage, addMessage } from '@/services/slices/chatSlice';
import { io, Socket } from 'socket.io-client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const Chat: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useParams({ from: '/chat/$userId' });
  const { messages, isLoading, error } = useSelector((state: RootState) => state.chat);
  const authState = useSelector((state: RootState) => state.auth.user);
  const currentUserId = authState?.user?.id; // Update this line
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchMessages(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    socketRef.current = io('http://localhost:3000');
    socketRef.current.emit('join', currentUserId);

    socketRef.current.on('newMessage', (message: any) => {
      dispatch(addMessage(message));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [currentUserId, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && userId) {
      dispatch(sendMessage({ receiverId: userId, content: newMessage }));
      setNewMessage('');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Button asChild className="mb-4">
        <Link to="/">Back to Landing Page</Link>
      </Button>
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle>Chat with {/* Add recipient name here */}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <ScrollArea className="h-full">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`mb-2 p-2 rounded ${
                  message.sender === currentUserId ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
                }`}
                style={{ maxWidth: '70%' }}
              >
                {message.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex w-full">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow mr-2"
            />
            <Button type="submit">Send</Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Chat;