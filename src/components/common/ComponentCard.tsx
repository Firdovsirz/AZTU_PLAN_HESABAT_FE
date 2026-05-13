interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
}) => {
  return (
    <div
      className={`group/card relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white/90 backdrop-blur-sm shadow-sm shadow-gray-900/[0.02] transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/[0.04] hover:border-gray-200 dark:border-gray-800 dark:bg-gray-900/40 ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
      <div className="px-6 py-5">
        <h3 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h3>
        {desc && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {desc}
          </p>
        )}
      </div>
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
