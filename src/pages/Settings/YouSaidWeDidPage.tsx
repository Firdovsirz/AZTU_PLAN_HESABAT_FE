import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Skeleton from "@mui/material/Skeleton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { RootState } from "../../redux/store";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { Modal } from "../../components/ui/modal";
import AdminGuard from "./AdminGuard";
import {
    YouSaidWeDid,
    getYouSaidWeDid,
    createYouSaidWeDid,
    updateYouSaidWeDid,
    deleteYouSaidWeDid,
} from "../../services/feedback/feedback";

function YouSaidWeDidManager() {
    const token = useSelector((s: RootState) => s.auth.token);
    const [rows, setRows] = useState<YouSaidWeDid[]>([]);
    const [loading, setLoading] = useState(true);

    // Create form
    const [youSaid, setYouSaid] = useState("");
    const [weDid, setWeDid] = useState("");
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");
    const [success, setSuccess] = useState("");

    // Edit / delete modals
    const [editRow, setEditRow] = useState<YouSaidWeDid | null>(null);
    const [editYouSaid, setEditYouSaid] = useState("");
    const [editWeDid, setEditWeDid] = useState("");
    const [deleteRow, setDeleteRow] = useState<YouSaidWeDid | null>(null);
    const [busy, setBusy] = useState(false);
    const [modalError, setModalError] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        setRows(await getYouSaidWeDid());
        setLoading(false);
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    useEffect(() => {
        if (editRow) {
            setEditYouSaid(editRow.you_said);
            setEditWeDid(editRow.we_did);
            setModalError("");
        }
    }, [editRow]);

    const flash = (msg: string) => {
        setSuccess(msg);
        setTimeout(() => setSuccess(""), 4000);
    };

    const handleCreate = async () => {
        const ys = youSaid.trim();
        const wd = weDid.trim();
        if (!ys || !wd) {
            setCreateError("Hər iki sahə doldurulmalıdır");
            return;
        }
        setCreating(true);
        setCreateError("");
        const res = await createYouSaidWeDid(ys, wd, token);
        setCreating(false);
        if (res?.statusCode === 201) {
            setYouSaid("");
            setWeDid("");
            flash("Əlavə edildi");
            load();
        } else {
            setCreateError(res?.message ?? "Xəta baş verdi");
        }
    };

    const handleEdit = async () => {
        if (!editRow) return;
        const ys = editYouSaid.trim();
        const wd = editWeDid.trim();
        if (!ys || !wd) {
            setModalError("Hər iki sahə doldurulmalıdır");
            return;
        }
        setBusy(true);
        setModalError("");
        const res = await updateYouSaidWeDid(editRow.id, { you_said: ys, we_did: wd }, token);
        setBusy(false);
        if (res?.statusCode === 200) {
            setEditRow(null);
            flash("Yeniləndi");
            load();
        } else {
            setModalError(res?.message ?? "Xəta baş verdi");
        }
    };

    const handleDelete = async () => {
        if (!deleteRow) return;
        setBusy(true);
        setModalError("");
        const res = await deleteYouSaidWeDid(deleteRow.id, token);
        setBusy(false);
        if (res?.statusCode === 200) {
            setDeleteRow(null);
            flash("Silindi");
            load();
        } else {
            setModalError(res?.message ?? "Xəta baş verdi");
        }
    };

    return (
        <>
            <PageMeta title="Siz dediniz, Biz etdik | İdarəetmə" description="Siz dediniz / Biz etdik bölməsinin idarə olunması" />
            <PageBreadcrumb pageTitle="Siz dediniz, Biz etdik" />

            <div className="space-y-6">
                <ComponentCard
                    title="Yeni qeyd əlavə et"
                    desc="Daxil etdiyiniz mətnlər ictimai açılış səhifəsində göstəriləcək"
                >
                    {success && (
                        <div className="mb-3 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300">
                            {success}
                        </div>
                    )}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                                Siz dediniz
                            </label>
                            <textarea
                                value={youSaid}
                                onChange={(e) => setYouSaid(e.target.value)}
                                rows={4}
                                placeholder="Maraqlı tərəflərin dediyi..."
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                                Biz etdik
                            </label>
                            <textarea
                                value={weDid}
                                onChange={(e) => setWeDid(e.target.value)}
                                rows={4}
                                placeholder="Cavab olaraq görülən iş..."
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                            />
                        </div>
                    </div>
                    {createError && <p className="mt-2 text-sm text-red-600">{createError}</p>}
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleCreate}
                            disabled={creating || !youSaid.trim() || !weDid.trim()}
                            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            <AddIcon fontSize="small" />
                            {creating ? "Əlavə edilir..." : "Əlavə et"}
                        </button>
                    </div>
                </ComponentCard>

                <ComponentCard title="Qeydlər" desc="Mövcud “Siz dediniz / Biz etdik” qeydləri">
                    {loading ? (
                        <div className="space-y-2">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} variant="rectangular" height={96} sx={{ borderRadius: 1 }} />
                            ))}
                        </div>
                    ) : rows.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-center">
                            <p className="text-gray-600 dark:text-gray-300">Hələ heç bir qeyd yoxdur</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {rows.map((r) => (
                                <div
                                    key={r.id}
                                    className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 p-4"
                                >
                                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                                        <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 dark:border-blue-500/20 dark:bg-blue-500/10">
                                            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-0.5">
                                                Siz dediniz
                                            </p>
                                            <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                                                {r.you_said}
                                            </p>
                                        </div>
                                        <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 dark:border-green-500/20 dark:bg-green-500/10">
                                            <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-0.5">
                                                Biz etdik
                                            </p>
                                            <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                                                {r.we_did}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => setEditRow(r)}
                                            className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300"
                                        >
                                            <EditIcon fontSize="small" />
                                            Redaktə et
                                        </button>
                                        <button
                                            onClick={() => { setDeleteRow(r); setModalError(""); }}
                                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
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
            </div>

            {/* Edit modal */}
            <Modal isOpen={!!editRow} onClose={() => setEditRow(null)} className="max-w-lg mx-auto">
                <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Qeydi redaktə et</h4>
                    <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Siz dediniz</label>
                    <textarea
                        value={editYouSaid}
                        onChange={(e) => setEditYouSaid(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                    />
                    <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1 mt-3">Biz etdik</label>
                    <textarea
                        value={editWeDid}
                        onChange={(e) => setEditWeDid(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                    />
                    {modalError && <p className="mt-2 text-sm text-red-600">{modalError}</p>}
                    <div className="mt-5 flex justify-end gap-2">
                        <button onClick={() => setEditRow(null)} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200">
                            Ləğv et
                        </button>
                        <button
                            onClick={handleEdit}
                            disabled={busy || !editYouSaid.trim() || !editWeDid.trim()}
                            className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            {busy ? "Yadda saxlanır..." : "Yadda saxla"}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete modal */}
            <Modal isOpen={!!deleteRow} onClose={() => setDeleteRow(null)} className="max-w-md mx-auto">
                <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Silməyi təsdiqlə</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Bu qeyd silinsin?</p>
                    {modalError && <p className="mt-2 text-sm text-red-600">{modalError}</p>}
                    <div className="mt-5 flex justify-end gap-2">
                        <button onClick={() => setDeleteRow(null)} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200">
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

export default function YouSaidWeDidPage() {
    return (
        <AdminGuard>
            <YouSaidWeDidManager />
        </AdminGuard>
    );
}
