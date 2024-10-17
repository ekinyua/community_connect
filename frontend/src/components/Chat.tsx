import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from '@tanstack/react-router';
import { AppDispatch, RootState } from '@/services/store';
import { fetchMessages, sendMessage, addMessage } from '@/services/slices/chatSlice';
import { io, Socket } from 'socket.io-client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Chat: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useParams({ from: '/chat/$userId' });
  const { messages, isLoading, error } = useSelector((state: RootState) => state.chat);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchMessages(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    socketRef.current = io('http://localhost:3000'); // URL should match backend

    socketRef.current.emit('join', currentUser?._id);

    socketRef.current.on('newMessage', (message: any) => {
      dispatch(addMessage(message));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [currentUser, dispatch]);

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
    <Card className="h-[calc(100vh-4rem)]">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto h-[calc(100%-8rem)]">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`mb-2 p-2 rounded ${
              message.sender === currentUser?._id ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
            }`}
            style={{ maxWidth: '70%' }}
          >
            {message.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter>
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </CardFooter>
    </Card>
  );
};

export default Chat;