import * as React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
};

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', style, ...props }) => {
  const base: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: 'var(--size-radius-lg)',
    fontWeight: 600,
    cursor: 'pointer',
    border: '1px solid transparent'
  };
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: 'var(--color-brand-primary)', color: 'white' },
    ghost: { background: 'transparent', color: 'var(--color-brand-primary)', borderColor: 'var(--color-brand-primary)' }
  };
  return <button style={{ ...base, ...variants[variant], ...style }} {...props} />;
};
