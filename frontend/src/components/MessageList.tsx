import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from '@tanstack/react-router';
import { AppDispatch, RootState } from '@/services/store';
import { fetchMessageList } from '@/services/slices/chatSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MessageList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { messageList, isLoading, error } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    dispatch(fetchMessageList());
  }, [dispatch]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Messages</h2>
      {messageList.map((message) => (
        <Card key={message._id}>
          <CardHeader>
            <CardTitle>{message.sender.username}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{message.content.substring(0, 50)}...</p>
            <Button asChild className="mt-2">
              <Link to={`/chat/${message.sender._id}`}>View Conversation</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MessageList;