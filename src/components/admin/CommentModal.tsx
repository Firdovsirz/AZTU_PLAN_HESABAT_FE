import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import { RootState } from "../../redux/store";
import { Modal } from "../ui/modal";
import {
    AppComment,
    CommentTarget,
    createComment,
    getComments,
    deleteComment,
} from "../../services/comment/comment";

export interface CommentModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetType: "plan" | "hesabat";
    targetSerial: string;
    ownerFinKod: string;
    onSuccess?: (message: string) => void;
}

type Scope = "item" | "user";

function formatDate(value: string | null): string {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleString("az-AZ", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function CommentModal({
    isOpen,
    onClose,
    targetType,
    targetSerial,
    ownerFinKod,
    onSuccess,
}: CommentModalProps) {
    const token = useSelector((s: RootState) => s.auth.token);
    const [scope, setScope] = useState<Scope>("item");
    const [text, setText] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [comments, setComments] = useState<AppComment[]>([]);
    const [loading, setLoading] = useState(false);

    const itemNoun = targetType === "plan" ? "plan" : "hesabat";

    // The effective comment target depends on the chosen scope.
    const effTarget: { type: CommentTarget; ref: string } =
        scope === "item"
            ? { type: targetType, ref: targetSerial }
            : { type: "user", ref: ownerFinKod };

    const load = useCallback(async () => {
        if (!isOpen) return;
        setLoading(true);
        const t: CommentTarget = scope === "item" ? targetType : "user";
        const r = scope === "item" ? targetSerial : ownerFinKod;
        setComments(await getComments(t, r, token));
        setLoading(false);
    }, [isOpen, scope, targetType, targetSerial, ownerFinKod, token]);

    useEffect(() => {
        if (isOpen) {
            setText("");
            setError("");
            setBusy(false);
        }
    }, [isOpen]);

    useEffect(() => {
        load();
    }, [load]);

    const handleSubmit = async () => {
        const comment = text.trim();
        if (!comment) {
            setError("Şərh boş ola bilməz");
            return;
        }
        setBusy(true);
        setError("");
        const res = await createComment(
            { target_type: effTarget.type, target_ref: effTarget.ref, comment },
            token
        );
        setBusy(false);
        if (res?.statusCode === 201) {
            setText("");
            onSuccess?.("Şərh əlavə edildi və istifadəçi məlumatlandırıldı");
            load();
        } else {
            setError(res?.message ?? "Xəta baş verdi");
        }
    };

    const handleDelete = async (id: number) => {
        const res = await deleteComment(id, token);
        if (res?.statusCode === 200) load();
    };

    const ScopeButton = ({ value, label }: { value: Scope; label: string }) => (
        <button
            type="button"
            onClick={() => setScope(value)}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                scope === value
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-800 dark:text-gray-300"
            }`}
        >
            {label}
        </button>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg mx-auto">
            <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Şərh əlavə et</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Şərh istifadəçiyə e-poçt və bildirişlə çatdırılacaq.
                </p>

                <div className="mb-3 flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-white/[0.03]">
                    <ScopeButton value="item" label={targetType === "plan" ? "Bu plan" : "Bu hesabat"} />
                    <ScopeButton value="user" label="İstifadəçinin bütün plan və hesabatları" />
                </div>

                <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-300">
                    {scope === "item" ? `#${targetSerial}` : `İstifadəçi: ${ownerFinKod}`}
                </div>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={3}
                    placeholder={
                        scope === "item"
                            ? `Bu ${itemNoun} üçün şərhinizi yazın...`
                            : "İstifadəçinin bütün plan və hesabatları üçün şərhinizi yazın..."
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                />
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                <div className="mt-3 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                    >
                        Bağla
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={busy || !text.trim()}
                        className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        {busy ? "Göndərilir..." : "Şərh əlavə et"}
                    </button>
                </div>

                {/* Existing comments for the current scope */}
                <div className="mt-5 border-t border-gray-100 pt-4 dark:border-gray-800">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Mövcud şərhlər
                    </p>
                    {loading ? (
                        <p className="text-sm text-gray-500">Yüklənir...</p>
                    ) : comments.length === 0 ? (
                        <p className="text-sm text-gray-500">Şərh yoxdur</p>
                    ) : (
                        <ul className="max-h-48 space-y-2 overflow-y-auto">
                            {comments.map((c) => (
                                <li
                                    key={c.id}
                                    className="flex items-start justify-between gap-2 rounded-lg border border-gray-200 bg-gray-50/60 px-3 py-2 dark:border-gray-700/70 dark:bg-white/[0.02]"
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                                            {c.comment}
                                        </p>
                                        <p className="mt-0.5 text-[11px] text-gray-400">{formatDate(c.created_at)}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(c.id)}
                                        className="shrink-0 rounded-md p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                                        title="Sil"
                                    >
                                        <DeleteIcon sx={{ fontSize: 16 }} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </Modal>
    );
}
