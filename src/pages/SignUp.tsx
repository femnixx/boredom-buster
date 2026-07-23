import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/auth/Checkbox';
import { PasswordStrength } from '../components/ui/PasswordStrength';
import { SocialLogin } from '../components/ui/SocialLogin';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeToTerms?: string;
  }>({});
  const { signup, loading } = useAuth();

  const validateForm = (): boolean => {
    const newErrors: {
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      agreeToTerms?: string;
    } = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await signup(formData.username, formData.email, formData.password);
      // Redirect will be handled by routing
    } catch (error) {
      setErrors({ email: 'Failed to create account. Please try again.' });
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
          <div className="absolute top-20 left-20 w-72 h-72 bg-[var(--charisma)] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[var(--vitality)] rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--vitality)] to-[var(--charisma)] flex items-center justify-center warm-glow">
              <span className="text-2xl font-cinzel font-bold text-[var(--text-primary)]">B</span>
            </div>
            <span className="text-2xl font-cinzel font-bold text-[var(--text-primary)]">Boredom Buster</span>
          </div>
          <ThemeToggle />
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-cinzel font-bold leading-tight text-[var(--text-primary)]">
            Start your journey to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--charisma)] to-[var(--vitality)]">
              greatness
            </span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)]">
            Create your account and transform everyday tasks into epic quests. Level up your life, one achievement at a time.
          </p>

          <div className="space-y-4 pt-8">
            <div className="rpg-panel p-4 flex items-start space-x-3">
              <div className="text-3xl">🎮</div>
              <div>
                <h3 className="font-cinzel font-semibold mb-1 text-[var(--text-primary)]">Gamified Productivity</h3>
                <p className="text-sm text-[var(--text-muted)]">Turn boring tasks into exciting quests with XP and rewards</p>
              </div>
            </div>
            <div className="rpg-panel p-4 flex items-start space-x-3">
              <div className="text-3xl">📊</div>
              <div>
                <h3 className="font-cinzel font-semibold mb-1 text-[var(--text-primary)]">Track Your Progress</h3>
                <p className="text-sm text-[var(--text-muted)]">Monitor streaks, achievements, and skill development</p>
              </div>
            </div>
            <div className="rpg-panel p-4 flex items-start space-x-3">
              <div className="text-3xl">🏆</div>
              <div>
                <h3 className="font-cinzel font-semibold mb-1 text-[var(--text-primary)]">Compete & Socialize</h3>
                <p className="text-sm text-[var(--text-muted)]">Join a community of achievers and climb the leaderboards</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-[var(--text-muted)]">
          © 2024 Boredom Buster. All rights reserved.
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[var(--bg-primary)]">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--vitality)] to-[var(--charisma)] flex items-center justify-center warm-glow">
                <span className="text-2xl font-cinzel font-bold text-[var(--text-primary)]">B</span>
              </div>
              <span className="text-2xl font-cinzel font-bold text-[var(--text-primary)]">Boredom Buster</span>
            </div>
          </div>

          <div className="rpg-panel p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-cinzel font-bold mb-2 text-[var(--text-primary)]">Create your account</h2>
              <p className="text-[var(--text-muted)]">Start your adventure today</p>
            </div>

             <form onSubmit={handleSubmit} className="space-y-5">
               <Input
                 label="Username"
                 type="text"
                 placeholder="BoredomBuster"
                 value={formData.username}
                 onChange={handleInputChange('username')}
                 error={errors.username}
                 required
               />

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
                 <label className="block text-sm font-medium text-[var(--text-secondary)]">
                   Password <span className="text-red-400">*</span>
                 </label>
                 <Input
                   label=""
                   type="password"
                   placeholder="••••••••••"
                   value={formData.password}
                   onChange={handleInputChange('password')}
                   error={errors.password}
                   required
                 />
                 <PasswordStrength password={formData.password} />
               </div>

               <Input
                 label="Confirm Password"
                 type="password"
                 placeholder="••••••••••"
                 value={formData.confirmPassword}
                 onChange={handleInputChange('confirmPassword')}
                 error={errors.confirmPassword}
                 required
               />

               <Checkbox
                 label="I agree to the Terms of Service and Privacy Policy"
                 checked={formData.agreeToTerms}
                 onChange={(checked) => setFormData(prev => ({ ...prev, agreeToTerms: checked }))}
               />
               {errors.agreeToTerms && (
                 <p className="text-sm text-red-400 flex items-center">
                   <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                   {errors.agreeToTerms}
                 </p>
               )}

               <Button type="submit" loading={loading} className="w-full bg-gradient-to-r from-[var(--vitality)] to-[var(--charisma)] hover:from-[var(--xp-success)] hover:to-[var(--vitality)]">
                 Create Account
               </Button>
             </form>

             <SocialLogin />

             <div className="mt-6 text-center">
               <p className="text-[var(--text-muted)]">
                 Already have an account?{' '}
                 <Link
                   to="/login"
                   className="text-[var(--vitality)] hover:text-[var(--xp-success)] font-semibold transition-colors"
                 >
                   Sign in
                 </Link>
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;