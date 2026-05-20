import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
    
    const variants = {
      primary: "bg-primary text-white hover:bg-primary-hover shadow-sm",
      secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
      outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 shadow-sm",
      ghost: "text-gray-600 hover:bg-gray-100",
      danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
    };

    const sizes = {
      sm: "h-9 px-3 text-xs",
      md: "h-10 px-4 py-2",
      lg: "h-12 px-6 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
