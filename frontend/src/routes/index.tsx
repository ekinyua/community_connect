import LogoutButton from '@/components/logout-button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { fetchCurrentUser } from '@/services/slices/authSlice';
import { AppDispatch, RootState } from '@/services/store';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const Route = createFileRoute('/')({
  component: () => <Index />,
});

export default function Index() {
  return (
    <>
      <h1>Welcome to the Home Page</h1>
      <CurrentUserInfo />
      <LogoutButton />
    </>
  );
}

export function CurrentUserInfo() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      // setFetchError(null);
      try {
        await dispatch(fetchCurrentUser()).unwrap();
      } catch (err) {
        setFetchError(err as string);
      }
    };

    fetchUser();
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading user information...</div>;
  }

  if (fetchError || error) {
    return <div className="text-red-500">Error: {fetchError || error}</div>;
  }

  if (!user) {
    return <div>No user information available</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current User Information</CardTitle>
        <CardDescription>Details of the logged-in user</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          <strong>ID:</strong> {user.id}
        </p>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>User Type:</strong> {user.userType}
        </p>
      </CardContent>
    </Card>
  );
}
