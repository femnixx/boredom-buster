import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/auth/Checkbox';
import { SocialLogin } from '../components/ui/SocialLogin';
import { ForgotPasswordModal } from '../components/auth/ForgotPasswordModal';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import FloatingLoginBanner from '../components/FloatingLoginBanner';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login, loading } = useAuth();

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await login(formData.email, formData.password);
      // Redirect will be handled by routing
    } catch (error) {
      setErrors({ password: 'Invalid email or password' });
    }
  };

  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[var(--vitality)] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[var(--intellect)] rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--vitality)] to-[var(--intellect)] flex items-center justify-center warm-glow-vitality">
              <span className="text-2xl font-cinzel font-bold text-[var(--text-primary)]">B</span>
            </div>
            <span className="text-2xl font-cinzel font-bold text-[var(--text-primary)]">Boredom Buster</span>
          </div>
          <ThemeToggle />
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-cinzel font-bold leading-tight text-[var(--text-primary)]">
            Turn your idle time into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--vitality)] to-[var(--intellect)]">
              achievement
            </span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)]">
            Join over 12,000 explorers gamifying their daily productivity and finding excitement in every small task.
          </p>
          
          <div className="space-y-4 pt-8">
            <FloatingLoginBanner />
          </div>
        </div>

        <div className="relative z-10 text-sm text-[var(--text-muted)]">
          © 2024 Boredom Buster. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[var(--bg-primary)]">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--vitality)] to-[var(--intellect)] flex items-center justify-center warm-glow-vitality">
                <span className="text-2xl font-cinzel font-bold text-[var(--text-primary)]">B</span>
              </div>
              <span className="text-2xl font-cinzel font-bold text-[var(--text-primary)]">Boredom Buster</span>
            </div>
          </div>

          <div className="rpg-panel p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-cinzel font-bold mb-2 text-[var(--text-primary)]">Welcome back</h2>
              <p className="text-[var(--text-muted)]">Log in to resume your progress</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
               <Input
                 label="Email Address"
                 type="email"
                 placeholder="explorer@boredombuster.com"
                 value={formData.email}
                 onChange={handleInputChange('email')}
                 error={errors.email}
                 required
               />

               <div className="space-y-2">
                 <div className="flex items-center justify-between">
                   <label className="block text-sm font-medium text-[var(--text-secondary)]">
                     Password <span className="text-red-400">*</span>
                   </label>
                   <button
                     type="button"
                     onClick={() => setShowForgotPassword(true)}
                     className="text-sm text-[var(--vitality)] hover:text-[var(--xp-success)] transition-colors"
                   >
                     Forgot password?
                   </button>
                 </div>
                 <Input
                   label=""
                   type="password"
                   placeholder="••••••••"
                   value={formData.password}
                   onChange={handleInputChange('password')}
                   error={errors.password}
                   required
                 />
               </div>

               <Checkbox
                 label="Keep me signed in"
                 checked={formData.rememberMe}
                 onChange={(checked) => setFormData(prev => ({ ...prev, rememberMe: checked }))}
               />

               <Button type="submit" loading={loading} className="w-full bg-gradient-to-r from-[var(--vitality)] to-[var(--intellect)] hover:from-[var(--xp-success)] hover:to-[var(--vitality)]">
                 Sign In
               </Button>
            </form>

            <SocialLogin />

            <div className="mt-6 text-center">
              <p className="text-[var(--text-muted)]">
                New to the journey?{' '}
                <Link
                  to="/signup"
                  className="text-[var(--vitality)] hover:text-[var(--xp-success)] font-semibold transition-colors"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onReset={async (email) => {
          console.log('Password reset for:', email);
          await new Promise(resolve => setTimeout(resolve, 1500));
        }}
      />
    </div>
  );
};

export default Login;