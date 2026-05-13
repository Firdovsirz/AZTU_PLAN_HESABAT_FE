import { useState } from "react";

interface SwitchProps {
  label: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  color?: "blue" | "gray"; // Added prop to toggle color theme
}

const Switch: React.FC<SwitchProps> = ({
  label,
  defaultChecked = false,
  disabled = false,
  onChange,
  color = "blue", // Default to blue color
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = () => {
    if (disabled) return;
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    if (onChange) {
      onChange(newCheckedState);
    }
  };

  const switchColors =
    color === "blue"
      ? {
          background: isChecked
            ? "bg-gradient-to-b from-brand-500 to-brand-600 shadow-inner shadow-brand-700/30"
            : "bg-gray-200 dark:bg-white/10",
        }
      : {
          background: isChecked
            ? "bg-gradient-to-b from-gray-700 to-gray-900"
            : "bg-gray-200 dark:bg-white/10",
        };

  return (
    <label
      className={`flex cursor-pointer select-none items-center gap-3 text-sm font-medium ${
        disabled ? "text-gray-400 cursor-not-allowed" : "text-gray-700 dark:text-gray-300"
      }`}
      onClick={handleToggle}
    >
      <div className="relative">
        <div
          className={`block transition-all duration-300 ease-out h-6 w-11 rounded-full ring-1 ring-inset ring-black/5 ${
            disabled
              ? "bg-gray-100 pointer-events-none dark:bg-gray-800"
              : switchColors.background
          }`}
        ></div>
        <div
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md ring-1 ring-black/5 transition-all duration-300 ease-out ${
            isChecked ? "left-[22px]" : "left-0.5"
          }`}
        ></div>
      </div>
      {label}
    </label>
  );
};

export default Switch;
