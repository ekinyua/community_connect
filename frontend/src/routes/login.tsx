import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { AppDispatch, RootState } from '@/services/store';
import { LoginInput, loginSchema } from '@/lib/schema';
import { login } from '@/services/slices/authSlice';

export const Route = createFileRoute('/login')({
  component: () => <LoginForm />,
});

export default function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const navigate = useNavigate();

  async function onSubmit(values: LoginInput) {
    try {
      await dispatch(login(values)).unwrap();
      navigate({ to: '/' });
    } catch (err) {
      setError(err as string);
    }
  }

  return (
    <Form {...form}>
      <div className="flex flex-col justify-center w-1/3 mx-auto h-screen">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 border rounded-lg p-6 shadow-lg">
          <h1 className="text-center text-4xl font-bold">Login</h1>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <Button
              size="lg"
              type="submit"
              disabled={isLoading}
              className="w-full max-w-xs text-xl">
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </div>
          <div className="text-center mt-4">
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-500 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </Form>
  );
}
