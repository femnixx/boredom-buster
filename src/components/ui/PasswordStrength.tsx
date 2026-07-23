import React from 'react';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const calculateStrength = (pwd: string): { score: number; label: string; color: string } => {
    if (!pwd) return { score: 0, label: '', color: '' };

    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { score, label: 'Fair', color: 'bg-[var(--willpower)]' };
    if (score <= 4) return { score, label: 'Good', color: 'bg-[var(--xp-success)]' };
    return { score, label: 'Strong', color: 'bg-[var(--vitality)]' };
  };

  const strength = calculateStrength(password);

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--text-muted)]">Password Strength</span>
        <span className={`font-semibold ${strength.color.replace('bg-', 'text-')}`}>
          {strength.label}
        </span>
      </div>
      <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
        <div
          className={`h-full ${strength.color} transition-all duration-300`}
          style={{ width: `${(strength.score / 5) * 100}%` }}
        />
      </div>
      <ul className="text-xs text-[var(--text-muted)] space-y-1">
        <li className={password.length >= 8 ? 'text-[var(--vitality)]' : ''}>
          • At least 8 characters
        </li>
        <li className={/[A-Z]/.test(password) && /[a-z]/.test(password) ? 'text-[var(--vitality)]' : ''}>
          • Mix of uppercase and lowercase
        </li>
        <li className={/\d/.test(password) ? 'text-[var(--vitality)]' : ''}>
          • At least one number
        </li>
        <li className={/[^a-zA-Z0-9]/.test(password) ? 'text-[var(--vitality)]' : ''}>
          • Special character
        </li>
      </ul>
    </div>
  );
};