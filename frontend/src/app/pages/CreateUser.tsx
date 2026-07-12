import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { apiFetch, ApiError } from '../../lib/api';
import { UserPlus, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['fleet_manager', 'driver', 'safety_officer', 'financial_analyst']),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

export default function CreateUser() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: 'driver',
    },
  });

  const onSubmit = async (data: CreateUserFormValues) => {
    setServerError(null);
    setSuccessMsg(null);
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        data,
      });
      setSuccessMsg(`User ${data.name} created successfully! Please inform them of their password manually.`);
      reset();
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message || 'Failed to create user');
      } else {
        setServerError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden p-6 max-w-2xl mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="size-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
          <UserPlus size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Create New User</h2>
          <p className="text-sm text-slate-500">Add a new team member to the system</p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start text-sm">
            <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start text-sm">
            <CheckCircle className="w-5 h-5 mr-2 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              {...register('name')}
              className={`w-full text-sm rounded-lg py-2 px-3 border ${
                errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 focus:ring-blue-500 focus:border-blue-500'
              } outline-none transition-all duration-200`}
              placeholder="John Doe"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              {...register('email')}
              className={`w-full text-sm rounded-lg py-2 px-3 border ${
                errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 focus:ring-blue-500 focus:border-blue-500'
              } outline-none transition-all duration-200`}
              placeholder="john@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              {...register('password')}
              className={`w-full text-sm rounded-lg py-2 px-3 border ${
                errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 focus:ring-blue-500 focus:border-blue-500'
              } outline-none transition-all duration-200`}
              placeholder="Min. 6 characters"
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">System Role</label>
            <select
              {...register('role')}
              className={`w-full text-sm rounded-lg py-2 px-3 border ${
                errors.role ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 focus:ring-blue-500 focus:border-blue-500'
              } outline-none transition-all duration-200 bg-white`}
            >
              <option value="driver">Driver</option>
              <option value="safety_officer">Safety Officer</option>
              <option value="financial_analyst">Financial Analyst</option>
              <option value="fleet_manager">Fleet Manager</option>
            </select>
            {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-blue-600/20 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            Create User
          </button>
        </div>
      </form>
    </div>
  );
}
