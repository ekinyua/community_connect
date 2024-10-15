import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/services/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpInput, signUpSchema } from '@/lib/schema';
import { signUp } from '@/services/slices/authSlice';

export const Route = createFileRoute('/signup')({
  component: () => <SignUpForm />,
});

export default function SignUpForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      userType: 'consumer',
    },
  });
  const navigate = useNavigate();

  async function onSubmit(values: SignUpInput) {
    try {
      await dispatch(signUp(values)).unwrap();
      navigate({ to: '/' });
    } catch (error) {
      console.error('Sign up failed:', error);
    }
  }

  return (
    <>
      <Form {...form}>
        <div className="flex flex-col justify-center w-1/3 mx-auto  h-screen ">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 border rounded-lg p-6 shadow-lg">
            <h1 className="text-center text-4xl font-bold">Sign Up</h1>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                    />
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
                  <FormDescription>
                    Password must be at least 6 characters long.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="consumer">Consumer</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="artisan">Artisan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full max-w-xs">
                {isLoading ? 'Signing up...' : 'Sign Up'}
              </Button>
            </div>
            <div className="text-center">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="text-blue-500 hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </Form>
    </>
  );
}
