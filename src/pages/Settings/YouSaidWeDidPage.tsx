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
    FeedbackStatus,
    getYouSaidWeDid,
    createYouSaidWeDid,
    updateYouSaidWeDid,
    deleteYouSaidWeDid,
} from "../../services/feedback/feedback";

const EMPTY = {
    you_said_az: "",
    you_said_en: "",
    we_did_az: "",
    we_did_en: "",
    status: "done" as FeedbackStatus,
};
type Form = typeof EMPTY;

const STATUS_LABEL: Record<FeedbackStatus, string> = {
    in_progress: "İcradadır",
    done: "Tamamlandı",
};

function FieldGrid({
    value,
    onChange,
}: {
    value: Form;
    onChange: (next: Form) => void;
}) {
    const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        onChange({ ...value, [k]: e.target.value });
    const cls =
        "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y";
    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Siz dediniz (AZ)</label>
                <textarea value={value.you_said_az} onChange={set("you_said_az")} rows={3} className={cls} />
            </div>
            <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">You said (EN)</label>
                <textarea value={value.you_said_en} onChange={set("you_said_en")} rows={3} className={cls} />
            </div>
            <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Biz etdik (AZ)</label>
                <textarea value={value.we_did_az} onChange={set("we_did_az")} rows={3} className={cls} />
            </div>
            <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">We did (EN)</label>
                <textarea value={value.we_did_en} onChange={set("we_did_en")} rows={3} className={cls} />
            </div>
            <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Status</label>
                <select
                    value={value.status}
                    onChange={(e) => onChange({ ...value, status: e.target.value as FeedbackStatus })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="done">Tamamlandı</option>
                    <option value="in_progress">İcradadır</option>
                </select>
            </div>
        </div>
    );
}

const filled = (f: Form) =>
    f.you_said_az.trim() && f.you_said_en.trim() && f.we_did_az.trim() && f.we_did_en.trim();

const trimmed = (f: Form): Form => ({
    you_said_az: f.you_said_az.trim(),
    you_said_en: f.you_said_en.trim(),
    we_did_az: f.we_did_az.trim(),
    we_did_en: f.we_did_en.trim(),
    status: f.status,
});

function YouSaidWeDidManager() {
    const token = useSelector((s: RootState) => s.auth.token);
    const [rows, setRows] = useState<YouSaidWeDid[]>([]);
    const [loading, setLoading] = useState(true);

    const [createForm, setCreateForm] = useState<Form>(EMPTY);
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");
    const [success, setSuccess] = useState("");

    const [editRow, setEditRow] = useState<YouSaidWeDid | null>(null);
    const [editForm, setEditForm] = useState<Form>(EMPTY);
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
            setEditForm({
                you_said_az: editRow.you_said_az,
                you_said_en: editRow.you_said_en,
                we_did_az: editRow.we_did_az,
                we_did_en: editRow.we_did_en,
                status: editRow.status,
            });
            setModalError("");
        }
    }, [editRow]);

    const flash = (msg: string) => {
        setSuccess(msg);
        setTimeout(() => setSuccess(""), 4000);
    };

    const handleCreate = async () => {
        if (!filled(createForm)) {
            setCreateError("Bütün sahələr (AZ və EN) doldurulmalıdır");
            return;
        }
        setCreating(true);
        setCreateError("");
        const res = await createYouSaidWeDid(trimmed(createForm), token);
        setCreating(false);
        if (res?.statusCode === 201) {
            setCreateForm(EMPTY);
            flash("Əlavə edildi");
            load();
        } else {
            setCreateError(res?.message ?? "Xəta baş verdi");
        }
    };

    const handleEdit = async () => {
        if (!editRow) return;
        if (!filled(editForm)) {
            setModalError("Bütün sahələr (AZ və EN) doldurulmalıdır");
            return;
        }
        setBusy(true);
        setModalError("");
        const res = await updateYouSaidWeDid(editRow.id, trimmed(editForm), token);
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

    const Pair = ({ label, az, en }: { label: string; az: string; en: string }) => (
        <div className="rounded-lg border border-gray-200 bg-gray-50/60 px-3 py-2 dark:border-gray-700/70 dark:bg-white/[0.02]">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{label}</p>
            <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                <span className="text-[10px] font-semibold uppercase text-brand-500 mr-1">AZ</span>
                {az}
            </p>
            <p className="mt-1 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                <span className="text-[10px] font-semibold uppercase text-emerald-500 mr-1">EN</span>
                {en}
            </p>
        </div>
    );

    return (
        <>
            <PageMeta title="Siz dediniz, Biz etdik | İdarəetmə" description="Siz dediniz / Biz etdik bölməsinin idarə olunması" />
            <PageBreadcrumb pageTitle="Siz dediniz, Biz etdik" />

            <div className="space-y-6">
                <ComponentCard
                    title="Yeni qeyd əlavə et"
                    desc="Mətnləri həm Azərbaycan, həm də İngilis dilində doldurun. Onlar ictimai səhifədə ziyarətçinin seçdiyi dildə göstəriləcək."
                >
                    {success && (
                        <div className="mb-3 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300">
                            {success}
                        </div>
                    )}
                    <FieldGrid value={createForm} onChange={setCreateForm} />
                    {createError && <p className="mt-2 text-sm text-red-600">{createError}</p>}
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleCreate}
                            disabled={creating || !filled(createForm)}
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
                                <Skeleton key={i} variant="rectangular" height={120} sx={{ borderRadius: 1 }} />
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
                                    <div className="mb-3">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                r.status === "in_progress"
                                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                                                    : "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300"
                                            }`}
                                        >
                                            {STATUS_LABEL[r.status] ?? r.status}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                                        <Pair label="Siz dediniz" az={r.you_said_az} en={r.you_said_en} />
                                        <Pair label="Biz etdik" az={r.we_did_az} en={r.we_did_en} />
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
            <Modal isOpen={!!editRow} onClose={() => setEditRow(null)} className="max-w-2xl mx-auto">
                <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Qeydi redaktə et</h4>
                    <FieldGrid value={editForm} onChange={setEditForm} />
                    {modalError && <p className="mt-2 text-sm text-red-600">{modalError}</p>}
                    <div className="mt-5 flex justify-end gap-2">
                        <button onClick={() => setEditRow(null)} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200">
                            Ləğv et
                        </button>
                        <button
                            onClick={handleEdit}
                            disabled={busy || !filled(editForm)}
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
