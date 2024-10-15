import { store } from '@/services/store';
import { selectAuth, fetchCurrentUser } from '@/services/slices/authSlice';

export async function checkAuthStatus() {
  const state = store.getState();
  let { user, isLoading } = selectAuth(state);

  if (!user && !isLoading) {
    await store.dispatch(fetchCurrentUser());
    const updatedState = store.getState();
    ({ user, isLoading } = selectAuth(updatedState));
  }

  return { user, isLoading };
}