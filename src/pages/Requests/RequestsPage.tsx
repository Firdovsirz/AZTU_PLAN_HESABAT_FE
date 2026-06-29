import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Skeleton from "@mui/material/Skeleton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { RootState } from "../../redux/store";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { Modal } from "../../components/ui/modal";
import RequestsAdminGuard from "./RequestsAdminGuard";
import {
    RequestType,
    UserRequest,
    getAllRequests,
    updateRequest,
    approveRequest,
    rejectRequest,
    deleteRequest,
} from "../../services/request/request";
import {
    StatusBadge,
    TypeBadge,
    TargetBadge,
    ProposedChangesList,
    formatDate,
} from "../../components/requests/requestUi";

function RequestsManager() {
    const token = useSelector((s: RootState) => s.auth.token);
    const [rows, setRows] = useState<UserRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const [editRow, setEditRow] = useState<UserRequest | null>(null);
    const [rejectRow, setRejectRow] = useState<UserRequest | null>(null);
    const [deleteR, setDeleteR] = useState<UserRequest | null>(null);

    const [editType, setEditType] = useState<RequestType>("edit");
    const [editText, setEditText] = useState("");
    const [rejectNote, setRejectNote] = useState("");

    const [busyId, setBusyId] = useState<number | null>(null);
    const [busy, setBusy] = useState(false);
    const [feedback, setFeedback] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        const data = await getAllRequests(token);
        setRows(data);
        setLoading(false);
    }, [token]);

    useEffect(() => {
        load();
    }, [load]);

    useEffect(() => {
        if (editRow) {
            setEditType(editRow.request_type);
            setEditText(editRow.request_text);
            setFeedback("");
        }
    }, [editRow]);

    useEffect(() => {
        if (rejectRow) {
            setRejectNote(rejectRow.reject_note ?? "");
            setFeedback("");
        }
    }, [rejectRow]);

    const handleApprove = async (row: UserRequest) => {
        setBusyId(row.id);
        const res = await approveRequest(row.id, token);
        setBusyId(null);
        if (res?.statusCode === 200) load();
    };

    const handleEdit = async () => {
        if (!editRow) return;
        const text = editText.trim();
        if (!text) {
            setFeedback("Mətn boş ola bilməz");
            return;
        }
        setBusy(true);
        setFeedback("");
        const res = await updateRequest(
            editRow.id,
            { request_type: editType, request_text: text },
            token
        );
        setBusy(false);
        if (res?.statusCode === 200) {
            setEditRow(null);
            load();
        } else {
            setFeedback(res?.message ?? "Xəta baş verdi");
        }
    };

    const handleReject = async () => {
        if (!rejectRow) return;
        const note = rejectNote.trim();
        if (!note) {
            setFeedback("Rədd səbəbi boş ola bilməz");
            return;
        }
        setBusy(true);
        setFeedback("");
        const res = await rejectRequest(rejectRow.id, note, token);
        setBusy(false);
        if (res?.statusCode === 200) {
            setRejectRow(null);
            load();
        } else {
            setFeedback(res?.message ?? "Xəta baş verdi");
        }
    };

    const handleDelete = async () => {
        if (!deleteR) return;
        setBusy(true);
        setFeedback("");
        const res = await deleteRequest(deleteR.id, token);
        setBusy(false);
        if (res?.statusCode === 200) {
            setDeleteR(null);
            load();
        } else {
            setFeedback(res?.message ?? "Xəta baş verdi");
        }
    };

    return (
        <>
            <PageMeta title="Sorğular | İdarəetmə" description="İstifadəçi sorğularının idarə olunması" />
            <PageBreadcrumb pageTitle="Sorğular" />
            <ComponentCard
                title="Sorğular"
                desc="İstifadəçilərdən gələn redaktə və silmə sorğuları"
            >
                {loading ? (
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} variant="rectangular" height={72} sx={{ borderRadius: 1 }} />
                        ))}
                    </div>
                ) : rows.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-center">
                        <p className="text-gray-600 dark:text-gray-300">Heç bir sorğu yoxdur</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {rows.map((r) => (
                            <div
                                key={r.id}
                                className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 p-4"
                            >
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <TypeBadge type={r.request_type} />
                                    <StatusBadge status={r.status} />
                                    <TargetBadge targetType={r.target_type} targetSerial={r.target_serial} />
                                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                        {r.requester_name ?? r.fin_kod}
                                    </span>
                                    <span className="text-xs text-gray-400">({r.fin_kod})</span>
                                    <span className="ml-auto text-xs text-gray-400">
                                        {formatDate(r.created_at)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                                    {r.request_text}
                                </p>
                                {r.request_type === "edit" && (
                                    <ProposedChangesList
                                        targetType={r.target_type}
                                        changes={r.proposed_changes}
                                    />
                                )}
                                {r.status === "rejected" && r.reject_note && (
                                    <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 dark:border-red-500/20 dark:bg-red-500/10">
                                        <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-0.5">
                                            Rədd səbəbi
                                        </p>
                                        <p className="text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap break-words">
                                            {r.reject_note}
                                        </p>
                                    </div>
                                )}

                                <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
                                    <button
                                        onClick={() => handleApprove(r)}
                                        disabled={busyId === r.id || r.status === "approved"}
                                        className="inline-flex items-center gap-1 rounded-lg border border-green-200 bg-green-50 px-2.5 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 disabled:opacity-50 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300"
                                    >
                                        <CheckCircleIcon fontSize="small" />
                                        Təsdiqlə
                                    </button>
                                    <button
                                        onClick={() => setRejectRow(r)}
                                        disabled={busyId === r.id}
                                        className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 disabled:opacity-50 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300"
                                    >
                                        <CancelIcon fontSize="small" />
                                        Rədd et
                                    </button>
                                    <button
                                        onClick={() => setEditRow(r)}
                                        disabled={busyId === r.id}
                                        className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300"
                                    >
                                        <EditIcon fontSize="small" />
                                        Redaktə et
                                    </button>
                                    <button
                                        onClick={() => setDeleteR(r)}
                                        disabled={busyId === r.id}
                                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
                                    >
                                        <DeleteIcon fontSize="small" />
                                        Sil
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ComponentCard>

            {/* Edit modal */}
            <Modal isOpen={!!editRow} onClose={() => setEditRow(null)} className="max-w-lg mx-auto">
                <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Sorğunu redaktə et
                    </h4>
                    <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Növ</label>
                    <select
                        value={editType}
                        onChange={(e) => setEditType(e.target.value as RequestType)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="edit">Redaktə</option>
                        <option value="delete">Silmə</option>
                    </select>
                    <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1 mt-3">Mətn</label>
                    <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={5}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                    />
                    {feedback && <p className="mt-2 text-sm text-red-600">{feedback}</p>}
                    <div className="mt-5 flex justify-end gap-2">
                        <button
                            onClick={() => setEditRow(null)}
                            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                        >
                            Ləğv et
                        </button>
                        <button
                            onClick={handleEdit}
                            disabled={busy || !editText.trim()}
                            className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            {busy ? "Yadda saxlanır..." : "Yadda saxla"}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Reject modal */}
            <Modal isOpen={!!rejectRow} onClose={() => setRejectRow(null)} className="max-w-lg mx-auto">
                <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Sorğunu rədd et
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        Rədd səbəbini yazın — istifadəçi bunu görəcək.
                    </p>
                    <textarea
                        value={rejectNote}
                        onChange={(e) => setRejectNote(e.target.value)}
                        rows={4}
                        placeholder="Rədd səbəbi..."
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                    />
                    {feedback && <p className="mt-2 text-sm text-red-600">{feedback}</p>}
                    <div className="mt-5 flex justify-end gap-2">
                        <button
                            onClick={() => setRejectRow(null)}
                            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                        >
                            Ləğv et
                        </button>
                        <button
                            onClick={handleReject}
                            disabled={busy || !rejectNote.trim()}
                            className="px-3 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-60"
                        >
                            {busy ? "Göndərilir..." : "Rədd et"}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete modal */}
            <Modal isOpen={!!deleteR} onClose={() => setDeleteR(null)} className="max-w-md mx-auto">
                <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Silməyi təsdiqlə</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Bu sorğu silinsin?
                    </p>
                    {feedback && <p className="mt-2 text-sm text-red-600">{feedback}</p>}
                    <div className="mt-5 flex justify-end gap-2">
                        <button
                            onClick={() => setDeleteR(null)}
                            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                        >
                            Ləğv et
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={busy}
                            className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                        >
                            {busy ? "Silinir..." : "Sil"}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default function RequestsPage() {
    return (
        <RequestsAdminGuard>
            <RequestsManager />
        </RequestsAdminGuard>
    );
}
