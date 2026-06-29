import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Modal } from "../ui/modal";
import {
    RequestTarget,
    RequestType,
    createRequest,
} from "../../services/request/request";

export interface RequestActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetType: RequestTarget;
    targetSerial: string;
    mode: RequestType; // "edit" | "delete"
    // Current field values, used to pre-fill the edit form.
    currentValues?: Record<string, unknown>;
    onSuccess?: () => void;
}

// Fields the user may propose changing, per target type. Kept in sync with the
// backend allow-lists in app/crud/plan.py and app/crud/hesabat.py.
const PLAN_FIELDS: { key: string; label: string; type: "text" | "number" | "date" }[] = [
    { key: "work_year", label: "İcra ili", type: "number" },
    { key: "work_desc", label: "İşin qısa təsviri", type: "text" },
    { key: "goal", label: "Hədəf", type: "text" },
    { key: "deadline", label: "Son tarix", type: "date" },
];

const HESABAT_FIELDS: { key: string; label: string; type: "text" | "number" | "date" }[] = [
    { key: "result_indicator", label: "Nəticə indikatoru", type: "text" },
    { key: "note", label: "Qeyd", type: "text" },
    { key: "done_percentage", label: "Uğur faizi", type: "text" },
];

// ISO date/datetime -> yyyy-mm-dd for a <input type="date">.
const toDateInput = (value: unknown): string => {
    if (!value) return "";
    const d = new Date(String(value));
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
};

export default function RequestActionModal({
    isOpen,
    onClose,
    targetType,
    targetSerial,
    mode,
    currentValues,
    onSuccess,
}: RequestActionModalProps) {
    const token = useSelector((s: RootState) => s.auth.token);
    const fields = targetType === "plan" ? PLAN_FIELDS : HESABAT_FIELDS;

    const [values, setValues] = useState<Record<string, string>>({});
    const [reason, setReason] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen) return;
        setReason("");
        setError("");
        setBusy(false);
        if (mode === "edit") {
            const init: Record<string, string> = {};
            for (const f of fields) {
                const raw = currentValues?.[f.key];
                init[f.key] = f.type === "date" ? toDateInput(raw) : raw == null ? "" : String(raw);
            }
            setValues(init);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, mode, targetType, targetSerial]);

    const isEdit = mode === "edit";

    const buildProposedChanges = (): Record<string, unknown> => {
        const changes: Record<string, unknown> = {};
        for (const f of fields) {
            const v = values[f.key] ?? "";
            if (f.type === "number") {
                if (v !== "") changes[f.key] = Number(v);
            } else {
                changes[f.key] = v;
            }
        }
        return changes;
    };

    const handleSubmit = async () => {
        const trimmedReason = reason.trim();
        if (!trimmedReason) {
            setError("Səbəb boş ola bilməz");
            return;
        }
        setBusy(true);
        setError("");
        const res = await createRequest(
            {
                request_type: mode,
                request_text: trimmedReason,
                target_type: targetType,
                target_serial: targetSerial,
                proposed_changes: isEdit ? buildProposedChanges() : null,
            },
            token
        );
        setBusy(false);
        if (res?.statusCode === 201) {
            onClose();
            onSuccess?.();
        } else {
            setError(res?.message ?? "Xəta baş verdi");
        }
    };

    const targetNoun = targetType === "plan" ? "plan" : "hesabat";

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg mx-auto">
            <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {isEdit ? "Redaktə sorğusu" : "Silmə sorğusu"}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {isEdit
                        ? `Aşağıdakı dəyişiklikləri təklif edin və səbəbini yazın. Sorğu admin tərəfindən təsdiqlənəcək.`
                        : `Bu ${targetNoun} silinməsi üçün səbəb yazın. Sorğu admin tərəfindən təsdiqlənəcək.`}
                </p>

                <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-300">
                    #{targetSerial}
                </div>

                {isEdit && (
                    <div className="space-y-3">
                        {fields.map((f) => (
                            <div key={f.key}>
                                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                                    {f.label}
                                </label>
                                <input
                                    type={f.type}
                                    value={values[f.key] ?? ""}
                                    onChange={(e) =>
                                        setValues((prev) => ({ ...prev, [f.key]: e.target.value }))
                                    }
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        ))}
                    </div>
                )}

                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1 mt-3">
                    Səbəb
                </label>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                    placeholder={isEdit ? "Bu dəyişikliyə niyə ehtiyac var?" : "Niyə silinməlidir?"}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                />

                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

                <div className="mt-5 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                    >
                        Ləğv et
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={busy || !reason.trim()}
                        className={`px-3 py-2 rounded-lg text-white disabled:opacity-60 ${
                            isEdit ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"
                        }`}
                    >
                        {busy ? "Göndərilir..." : "Sorğu göndər"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
