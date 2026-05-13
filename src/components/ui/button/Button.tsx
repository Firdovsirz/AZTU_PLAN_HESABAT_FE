import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "outline" | "ghost" | "danger";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  type = "submit",
}) => {
  const sizeClasses = {
    sm: "px-3.5 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantClasses = {
    primary:
      "bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/25 ring-1 ring-inset ring-brand-400/40 hover:from-brand-600 hover:to-brand-700 hover:shadow-lg hover:shadow-brand-500/30 disabled:from-brand-300 disabled:to-brand-400 disabled:shadow-none",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-200 shadow-sm hover:bg-gray-50 hover:ring-gray-300 dark:bg-gray-900/60 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-white/[0.03]",
    ghost:
      "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/[0.06] dark:hover:text-white",
    danger:
      "bg-gradient-to-b from-error-500 to-error-600 text-white shadow-md shadow-error-500/25 ring-1 ring-inset ring-error-400/40 hover:from-error-600 hover:to-error-700",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 active:scale-[0.98] focus:outline-hidden focus:ring-4 focus:ring-brand-500/15 ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-60 active:scale-100" : ""
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
