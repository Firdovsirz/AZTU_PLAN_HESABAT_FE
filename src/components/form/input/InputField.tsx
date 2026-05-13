import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  className?: string;
  success?: boolean;
  error?: boolean;
  hint?: string;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      id,
      name,
      placeholder,
      value,
      onChange,
      onKeyDown,
      onBlur,
      className = "",
      min,
      max,
      step,
      disabled = false,
      success = false,
      error = false,
      hint,
      required,
      ...rest
    },
    ref
  ) => {
    let inputClasses = `h-11 w-full rounded-xl border appearance-none px-4 py-2.5 text-sm shadow-sm shadow-gray-900/[0.02] placeholder:text-gray-400 focus:outline-hidden focus:ring-4 transition-all duration-200 dark:bg-gray-900/60 dark:text-white/90 dark:placeholder:text-white/30 ${className}`;

    if (disabled) {
      inputClasses += ` text-gray-500 border-gray-200 bg-gray-50 cursor-not-allowed opacity-60 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
    } else if (error) {
      inputClasses += ` bg-error-25 text-error-700 border-error-300 focus:border-error-500 focus:ring-error-500/15 dark:bg-error-500/[0.06] dark:text-error-400 dark:border-error-500/60 dark:focus:border-error-500`;
    } else if (success) {
      inputClasses += ` bg-success-25 text-success-700 border-success-300 focus:border-success-500 focus:ring-success-500/15 dark:bg-success-500/[0.06] dark:text-success-400 dark:border-success-500/60 dark:focus:border-success-500`;
    } else {
      inputClasses += ` bg-white text-gray-800 border-gray-200 hover:border-gray-300 focus:border-brand-400 focus:ring-brand-500/15 focus:bg-white dark:border-gray-700/70 dark:text-white/90 dark:hover:border-gray-600 dark:focus:border-brand-500`;
    }

    return (
      <div className="relative">
        <input
          ref={ref}
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...rest}
        />
        {hint && (
          <p
            className={`mt-1.5 text-xs ${
              error
                ? "text-error-500"
                : success
                ? "text-success-500"
                : "text-gray-500"
            }`}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

export default Input;