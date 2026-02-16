import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { loginSchema, type LoginFormValues, validateCredentials } from './schemas';
import { setStoredAuth } from '@/utils/auth-storage';
import { isAuthenticated } from '@/utils/auth-storage';
import { Button } from '@/components/Button';
import { FormInput } from '@/components/FormInput';

export function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/board', { replace: true });
    }
  }, [navigate]);

  const onSubmit = (data: LoginFormValues) => {
    if (!validateCredentials(data.email, data.password)) {
      setError('root', { message: 'Invalid email or password' });
      return;
    }
    setStoredAuth(data.email, data.rememberMe ?? false);
    navigate('/board', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <h1 className="text-2xl font-semibold text-slate-800 text-center mb-2">Task Board</h1>
          <p className="text-slate-500 text-center text-sm mb-8">Sign in to continue</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {errors.root && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2" role="alert">
                {errors.root.message}
              </div>
            )}
            <FormInput
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="your@domain.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <FormInput
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••"
              error={errors.password?.message}
              {...register('password')}
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300" {...register('rememberMe')} />
              <span className="text-sm text-slate-600">Remember me</span>
            </label>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </div>
        <p className="text-center text-slate-400 text-xs mt-6">
          Demo: abc@demo.com / abc123
        </p>
      </div>
    </div>
  );
}
