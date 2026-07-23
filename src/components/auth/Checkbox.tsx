import React from 'react';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled = false
}) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div className={`
          w-5 h-5 border-2 rounded transition-all duration-200
          flex items-center justify-center
          ${checked 
            ? 'bg-[var(--vitality)] border-[var(--vitality)]' 
            : 'border-[var(--border-color)] group-hover:border-[var(--vitality)]'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}>
          {checked && (
            <svg className="w-3 h-3 text-[var(--bg-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <span className="text-sm text-[var(--text-secondary)] select-none">{label}</span>
    </label>
  );
};