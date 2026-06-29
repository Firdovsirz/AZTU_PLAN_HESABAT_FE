import { RequestStatus, RequestTarget, RequestType } from "../../services/request/request";

export const STATUS_LABEL: Record<RequestStatus, string> = {
    pending: "Gözləyir",
    approved: "Təsdiqləndi",
    rejected: "Rədd edildi",
};

export const TYPE_LABEL: Record<RequestType, string> = {
    edit: "Redaktə",
    delete: "Silmə",
};

// Human labels for the proposed-change fields, kept in sync with the backend
// allow-lists (app/crud/plan.py, app/crud/hesabat.py).
const PLAN_FIELD_LABELS: Record<string, string> = {
    work_year: "İcra ili",
    work_desc: "İşin təsviri",
    goal: "Hədəf",
    deadline: "Son tarix",
};

const HESABAT_FIELD_LABELS: Record<string, string> = {
    result_indicator: "Nəticə indikatoru",
    note: "Qeyd",
    done_percentage: "Uğur faizi",
};

export function TargetBadge({
    targetType,
    targetSerial,
}: {
    targetType: RequestTarget | null;
    targetSerial: string | null;
}) {
    if (!targetType || !targetSerial) return null;
    const label = targetType === "plan" ? "Plan" : "Hesabat";
    return (
        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-700 ring-1 ring-inset ring-gray-200 dark:bg-white/5 dark:text-gray-300 dark:ring-white/10">
            {label} #{targetSerial}
        </span>
    );
}

export function ProposedChangesList({
    targetType,
    changes,
}: {
    targetType: RequestTarget | null;
    changes: Record<string, unknown> | null;
}) {
    if (!changes) return null;
    const entries = Object.entries(changes);
    if (entries.length === 0) return null;
    const labels = targetType === "hesabat" ? HESABAT_FIELD_LABELS : PLAN_FIELD_LABELS;
    return (
        <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 dark:border-blue-500/20 dark:bg-blue-500/10">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">
                Təklif olunan dəyişikliklər
            </p>
            <ul className="space-y-0.5">
                {entries.map(([key, value]) => (
                    <li key={key} className="text-sm text-blue-800 dark:text-blue-200">
                        <span className="font-medium">{labels[key] ?? key}:</span>{" "}
                        {value === null || value === "" ? "—" : String(value)}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function StatusBadge({ status }: { status: RequestStatus }) {
    const styles: Record<RequestStatus, string> = {
        pending:
            "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
        approved:
            "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300",
        rejected:
            "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
    };
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
        >
            {STATUS_LABEL[status] ?? status}
        </span>
    );
}

export function TypeBadge({ type }: { type: RequestType }) {
    const isEdit = type === "edit";
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isEdit
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                    : "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300"
            }`}
        >
            {TYPE_LABEL[type] ?? type}
        </span>
    );
}

export function formatDate(value: string | null): string {
    if (!value) return "-";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleString("az-AZ", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
