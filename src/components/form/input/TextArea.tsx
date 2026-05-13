import React from "react";

interface TextareaProps {
  placeholder?: string; // Placeholder text
  rows?: number; // Number of rows
  value?: string; // Current value
  onChange?: (value: string) => void; // Change handler
  className?: string; // Additional CSS classes
  disabled?: boolean; // Disabled state
  error?: boolean; // Error state
  hint?: string; // Hint text to display
}

const TextArea: React.FC<TextareaProps> = ({
  placeholder = "Enter your message", // Default placeholder
  rows = 3, // Default number of rows
  value = "", // Default value
  onChange, // Callback for changes
  className = "", // Additional custom styles
  disabled = false, // Disabled state
  error = false, // Error state
  hint = "", // Default hint text
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  let textareaClasses = `w-full rounded-xl border px-4 py-3 text-sm shadow-sm shadow-gray-900/[0.02] transition-all duration-200 focus:outline-hidden focus:ring-4 placeholder:text-gray-400 ${className} `;

  if (disabled) {
    textareaClasses += ` bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed opacity-60 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    textareaClasses += ` bg-error-25 text-error-700 border-error-300 focus:border-error-500 focus:ring-error-500/15 dark:bg-error-500/[0.06] dark:border-error-500/60 dark:text-error-400 dark:focus:border-error-500`;
  } else {
    textareaClasses += ` bg-white text-gray-800 border-gray-200 hover:border-gray-300 focus:border-brand-400 focus:ring-brand-500/15 dark:border-gray-700/70 dark:bg-gray-900/60 dark:text-white/90 dark:hover:border-gray-600 dark:focus:border-brand-500`;
  }

  return (
    <div className="relative">
      <textarea
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={textareaClasses}
      />
      {hint && (
        <p
          className={`mt-2 text-sm ${
            error ? "text-error-500" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default TextArea;
