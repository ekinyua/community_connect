import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser, selectAuth } from '@/services/slices/authSlice';
import { useNavigate } from '@tanstack/react-router';
import { store } from '@/services/store';
import { AppDispatch } from '@/services/store';

export function useAuth(redirectPath: string = '/login') {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector(selectAuth);

  useEffect(() => {
    const checkAuth = async () => {
      if (!user && !isLoading) {
        await dispatch(fetchCurrentUser());
        const updatedUser = selectAuth(store.getState()).user;
        if (!updatedUser) {
          navigate({
            to: redirectPath,
            search: { redirect: window.location.pathname },
          });
        }
      }
    };

    checkAuth();
  }, [dispatch, navigate, user, isLoading, redirectPath]);

  return { user, isLoading };
}