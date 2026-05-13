import { FC } from "react";

interface FileInputProps {
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileInput: FC<FileInputProps> = ({ className, onChange }) => {
  return (
    <input
      type="file"
      className={`h-11 w-full overflow-hidden rounded-xl border border-gray-200 bg-white text-sm text-gray-500 shadow-sm shadow-gray-900/[0.02] transition-all duration-200 hover:border-gray-300 focus:border-brand-400 focus:outline-hidden focus:ring-4 focus:ring-brand-500/15 file:mr-4 file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gradient-to-b file:from-gray-50 file:to-gray-100 file:py-3 file:pl-4 file:pr-4 file:text-sm file:font-medium file:text-gray-700 hover:file:from-brand-50 hover:file:to-brand-100 hover:file:text-brand-700 dark:border-gray-700/70 dark:bg-gray-900/60 dark:text-gray-400 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-300 ${className}`}
      onChange={onChange}
    />
  );
};

export default FileInput;
