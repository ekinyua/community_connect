import { logout } from '@/services/slices/authSlice';
import { AppDispatch, RootState } from '@/services/store';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import { useNavigate } from '@tanstack/react-router';
import { cn } from '@/lib/utils';

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogout = async () => {
    setError(null);
    try {
      await dispatch(logout()).unwrap();
      navigate({ to: '/login' });
    } catch (err) {
      setError(err as string);
    }
  };

  return (
    <div>
      <Button
        onClick={handleLogout}
        disabled={isLoading}
        className={cn('', className)}>
        {isLoading ? 'Logging out...' : 'Logout'}
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
