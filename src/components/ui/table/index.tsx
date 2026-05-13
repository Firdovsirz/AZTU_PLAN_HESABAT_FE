import { ReactNode } from "react";

// Props for Table
interface TableProps {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string; // Optional className for styling
}

// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode; // Header row(s)
  className?: string; // Optional className for styling
}

// Props for TableBody
interface TableBodyProps {
  children: ReactNode; // Body row(s)
  className?: string; // Optional className for styling
}

// Props for TableRow
interface TableRowProps {
  children: ReactNode; // Cells (th or td)
  className?: string; // Optional className for styling
}

// Props for TableCell
interface TableCellProps {
  children: ReactNode; // Cell content
  isHeader?: boolean; // If true, renders as <th>, otherwise <td>
  className?: string; // Optional className for styling
  colSpan?: number;
}

// Table Component
const Table: React.FC<TableProps> = ({ children, className }) => {
  return <table className={`min-w-full border-separate border-spacing-0 ${className ?? ""}`}>{children}</table>;
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={`bg-gray-50/80 backdrop-blur-sm dark:bg-white/[0.02] ${className ?? ""}`}>{children}</thead>;
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={`divide-y divide-gray-100 dark:divide-gray-800/60 ${className ?? ""}`}>{children}</tbody>;
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return <tr className={`group/tr transition-colors hover:bg-brand-50/30 dark:hover:bg-white/[0.02] ${className ?? ""}`}>{children}</tr>;
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
  colSpan,
}) => {
  const CellTag = isHeader ? "th" : "td";
  const base = isHeader
    ? "px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 first:pl-6 last:pr-6"
    : "px-5 py-4 text-sm text-gray-700 dark:text-gray-300 align-middle first:pl-6 last:pr-6";
  return <CellTag className={`${base} ${className ?? ""}`} colSpan={colSpan}>{children}</CellTag>;
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
