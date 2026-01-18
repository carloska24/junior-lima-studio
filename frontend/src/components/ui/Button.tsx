import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'outline' | 'ghost';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', children, ...props }, ref) => {
    const variants = {
      primary: 'bg-gold-500 text-midnight-900 hover:bg-gold-400 border border-gold-500',
      outline: 'bg-transparent text-gold-500 border border-gold-500 hover:bg-gold-500/10',
      ghost: 'bg-transparent text-gray-300 hover:text-gold-500',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(212, 175, 55, 0.3)' }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'px-8 py-4 rounded-sm uppercase tracking-[0.2em] text-xs font-semibold transition-colors duration-300',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
