import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import TableViewIcon from "@mui/icons-material/TableView";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { ExportFormat, ExportResult } from "../../services/export/exportService";

interface ExportButtonsProps {
    label?: string;
    onExport: (format: ExportFormat) => Promise<ExportResult>;
    disabled?: boolean;
}

// Literal class strings so Tailwind keeps them.
const OPTIONS: { format: ExportFormat; text: string; title: string; Icon: typeof PictureAsPdfIcon; className: string }[] = [
    {
        format: "pdf",
        text: "PDF",
        title: "Rəsmi PDF sənədi kimi yüklə",
        Icon: PictureAsPdfIcon,
        className: "bg-error-50 text-error-600 ring-error-200/70 hover:bg-error-100 dark:bg-error-500/10 dark:text-error-400 dark:ring-error-500/20",
    },
    {
        format: "xlsx",
        text: "Excel",
        title: "Excel cədvəli kimi yüklə",
        Icon: TableViewIcon,
        className: "bg-success-50 text-success-700 ring-success-200/70 hover:bg-success-100 dark:bg-success-500/10 dark:text-success-400 dark:ring-success-500/20",
    },
];

export default function ExportButtons({ label = "İxrac et", onExport, disabled = false }: ExportButtonsProps) {
    const [busy, setBusy] = useState<ExportFormat | null>(null);
    const [error, setError] = useState("");

    const run = async (format: ExportFormat) => {
        setBusy(format);
        setError("");
        const result = await onExport(format);
        if (!result.ok) setError(result.message);
        setBusy(null);
    };

    return (
        <div className="flex flex-col items-start gap-1.5 sm:items-end">
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}:</span>
                {OPTIONS.map(({ format, text, title, Icon, className }) => (
                    <button
                        key={format}
                        type="button"
                        title={title}
                        disabled={disabled || busy !== null}
                        onClick={() => run(format)}
                        className={`inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-sm font-medium ring-1 ring-inset transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
                    >
                        {busy === format ? <CircularProgress size={14} color="inherit" /> : <Icon sx={{ fontSize: 18 }} />}
                        {text}
                    </button>
                ))}
            </div>
            {error && <p className="text-xs text-error-600 dark:text-error-400">{error}</p>}
        </div>
    );
}
