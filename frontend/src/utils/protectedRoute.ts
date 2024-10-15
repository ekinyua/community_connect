import { useAuth } from '@/hooks/useAuth';

interface RouteConfig {
  path?: string;
  component?: React.ComponentType;
  // Add other known properties
}

export function protectedRoute(routeConfig: RouteConfig) {
  const { component: Component, ...rest } = routeConfig;

  const ProtectedComponent = (props: any) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      return null; // or a loading spinner
    }

    return Component ? <Component { ...props } /> : null;
  };

  return {
    ...rest,
    component: ProtectedComponent,
  };
}