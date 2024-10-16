import { StrictMode, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import './index.css';
import { routeTree } from './routeTree.gen';
import { Provider, useDispatch } from 'react-redux';
import { AppDispatch, store } from './services/store';
import { ThemeProvider } from './lib/theme-provider';
import { fetchCurrentUserProfile } from './services/slices/profileSlice';

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const AppWrapper = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCurrentUserProfile());
  }, [dispatch]);

  return <RouterProvider router={router} />;
};

// Render the app
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Provider store={store}>
          <AppWrapper />
        </Provider>
      </ThemeProvider>
    </StrictMode>
  );
}
