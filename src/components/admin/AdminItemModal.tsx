import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Modal } from "../ui/modal";
import {
    adminEditPlan,
    adminDeletePlan,
    getPlanBySerialNumber,
} from "../../services/plan/plan";
import {
    adminEditHesabat,
    deleteHesabat,
    getHesabatBySerialNumber,
} from "../../services/hesabat/hesabatService";

type TargetType = "plan" | "hesabat";
type Mode = "edit" | "delete";

export interface AdminItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetType: TargetType;
    targetSerial: string;
    mode: Mode;
    onSuccess?: (message: string) => void;
}

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

const toDateInput = (value: unknown): string => {
    if (!value) return "";
    const d = new Date(String(value));
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
};

export default function AdminItemModal({
    isOpen,
    onClose,
    targetType,
    targetSerial,
    mode,
    onSuccess,
}: AdminItemModalProps) {
    const token = useSelector((s: RootState) => s.auth.token);
    const fields = targetType === "plan" ? PLAN_FIELDS : HESABAT_FIELDS;

    const [values, setValues] = useState<Record<string, string>>({});
    const [initial, setInitial] = useState<Record<string, string>>({});
    const [busy, setBusy] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadFailed, setLoadFailed] = useState(false);
    const [error, setError] = useState("");

    // Load the current values so the edit form is accurate (some list views do
    // not carry every editable field).
    useEffect(() => {
        if (!isOpen) return;
        setError("");
        setBusy(false);
        setLoadFailed(false);
        if (mode !== "edit") return;

        let cancelled = false;
        setLoading(true);
        const fetcher =
            targetType === "plan"
                ? getPlanBySerialNumber(targetSerial, token ?? "")
                : getHesabatBySerialNumber(targetSerial, token ?? "");

        Promise.resolve(fetcher)
            .then((res) => {
                if (cancelled) return;
                // A string result means the fetch failed; do not present a blank
                // form that would otherwise overwrite real values with empties.
                if (typeof res === "string" || !res) {
                    setLoadFailed(true);
                    setError("Mövcud məlumat yüklənə bilmədi. Yenidən cəhd edin.");
                    return;
                }
                const data = res as Record<string, unknown>;
                const init: Record<string, string> = {};
                for (const f of fields) {
                    const raw = data[f.key];
                    init[f.key] = f.type === "date" ? toDateInput(raw) : raw == null ? "" : String(raw);
                }
                setValues(init);
                setInitial(init);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, mode, targetType, targetSerial]);

    // Only send fields the admin actually changed, so untouched fields are never
    // overwritten with empty values (PATCH semantics).
    const buildChanges = (): Record<string, unknown> => {
        const changes: Record<string, unknown> = {};
        for (const f of fields) {
            const v = values[f.key] ?? "";
            if (v === (initial[f.key] ?? "")) continue;
            if (f.type === "number") {
                if (v !== "") changes[f.key] = Number(v);
            } else {
                changes[f.key] = v;
            }
        }
        return changes;
    };

    const handleEdit = async () => {
        const changes = buildChanges();
        if (Object.keys(changes).length === 0) {
            setError("Heç bir dəyişiklik edilməyib");
            return;
        }
        setBusy(true);
        setError("");
        const res =
            targetType === "plan"
                ? await adminEditPlan(targetSerial, changes, token)
                : await adminEditHesabat(targetSerial, changes, token);
        setBusy(false);
        if (res?.statusCode === 200) {
            onClose();
            onSuccess?.("Dəyişiklik yadda saxlanıldı və istifadəçi məlumatlandırıldı");
        } else {
            setError(res?.message ?? "Xəta baş verdi");
        }
    };

    const handleDelete = async () => {
        setBusy(true);
        setError("");
        const res =
            targetType === "plan"
                ? await adminDeletePlan(targetSerial, token)
                : await deleteHesabat(targetSerial, token);
        setBusy(false);
        if (res?.statusCode === 200) {
            onClose();
            onSuccess?.("Silindi və istifadəçi məlumatlandırıldı");
        } else {
            setError(res?.message ?? "Xəta baş verdi");
        }
    };

    const isEdit = mode === "edit";
    const targetNoun = targetType === "plan" ? "plan" : "hesabat";

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg mx-auto">
            <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {isEdit ? `${targetType === "plan" ? "Planı" : "Hesabatı"} redaktə et` : `${targetType === "plan" ? "Planı" : "Hesabatı"} sil`}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {isEdit
                        ? "Dəyişiklik birbaşa tətbiq olunacaq və istifadəçi e-poçt və bildirişlə məlumatlandırılacaq."
                        : `Bu ${targetNoun} birbaşa silinəcək və istifadəçi e-poçt və bildirişlə məlumatlandırılacaq.`}
                </p>

                <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-300">
                    #{targetSerial}
                </div>

                {isEdit &&
                    (loading ? (
                        <p className="text-sm text-gray-500">Yüklənir...</p>
                    ) : (
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
                    ))}

                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

                <div className="mt-5 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                    >
                        Ləğv et
                    </button>
                    <button
                        onClick={isEdit ? handleEdit : handleDelete}
                        disabled={busy || loading || (isEdit && loadFailed)}
                        className={`px-3 py-2 rounded-lg text-white disabled:opacity-60 ${
                            isEdit ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"
                        }`}
                    >
                        {busy ? "Gözləyin..." : isEdit ? "Yadda saxla" : "Sil"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
