import { useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Modal } from "../ui/modal";

export interface CrudRow {
    id: number | string;
    code: string | number;
    name: string;
    [extra: string]: unknown;
}

export interface CrudCreateField {
    key: "code" | "name";
    label: string;
    type?: "text" | "number";
}

export interface CrudEditExtraField {
    key: string;
    label: string;
    type: "select";
    options: { value: string; label: string }[];
}

export interface CrudExtraColumn {
    key: string;
    label: string;
    render: (row: CrudRow) => React.ReactNode;
}

interface CrudTableProps {
    title: string;
    rows: CrudRow[];
    loading: boolean;
    error?: string;
    canCreate?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
    createFields?: CrudCreateField[];
    editExtraFields?: CrudEditExtraField[];
    extraColumns?: CrudExtraColumn[];
    getInitialEditExtra?: (row: CrudRow) => Record<string, string>;
    onRefresh: () => void;
    onCreate?: (values: Record<string, string>) => Promise<{ ok: boolean; message?: string }>;
    onUpdate?: (
        row: CrudRow,
        newName: string,
        extra?: Record<string, string>
    ) => Promise<{ ok: boolean; message?: string }>;
    onDelete?: (row: CrudRow) => Promise<{ ok: boolean; message?: string }>;
    headerExtra?: React.ReactNode;
    codeLabel?: string;
    nameLabel?: string;
}

export default function CrudTable({
    title,
    rows,
    loading,
    error,
    canCreate = false,
    canEdit = true,
    canDelete = true,
    createFields,
    editExtraFields,
    extraColumns,
    getInitialEditExtra,
    onRefresh,
    onCreate,
    onUpdate,
    onDelete,
    headerExtra,
    codeLabel = "Kod",
    nameLabel = "Ad"
}: CrudTableProps) {
    const [editRow, setEditRow] = useState<CrudRow | null>(null);
    const [deleteRow, setDeleteRow] = useState<CrudRow | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [editValue, setEditValue] = useState("");
    const [editExtraValues, setEditExtraValues] = useState<Record<string, string>>({});
    const [createValues, setCreateValues] = useState<Record<string, string>>({});
    const [busy, setBusy] = useState(false);
    const [feedback, setFeedback] = useState<string>("");

    useEffect(() => {
        if (editRow) {
            setEditValue(editRow.name);
            setEditExtraValues(getInitialEditExtra ? getInitialEditExtra(editRow) : {});
        }
    }, [editRow]);

    useEffect(() => {
        if (createOpen) setCreateValues({});
    }, [createOpen]);

    const handleCreate = async () => {
        if (!onCreate) return;
        setBusy(true);
        setFeedback("");
        const res = await onCreate(createValues);
        setBusy(false);
        if (res.ok) {
            setCreateOpen(false);
            onRefresh();
        } else {
            setFeedback(res.message ?? "Xəta baş verdi");
        }
    };

    const handleUpdate = async () => {
        if (!editRow || !onUpdate) return;
        setBusy(true);
        setFeedback("");
        const res = await onUpdate(editRow, editValue, editExtraValues);
        setBusy(false);
        if (res.ok) {
            setEditRow(null);
            onRefresh();
        } else {
            setFeedback(res.message ?? "Xəta baş verdi");
        }
    };

    const handleDelete = async () => {
        if (!deleteRow || !onDelete) return;
        setBusy(true);
        setFeedback("");
        const res = await onDelete(deleteRow);
        setBusy(false);
        if (res.ok) {
            setDeleteRow(null);
            onRefresh();
        } else {
            setFeedback(res.message ?? "Xəta baş verdi");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
                <div className="flex items-center gap-2">
                    {headerExtra}
                    {canCreate && onCreate && (
                        <button
                            onClick={() => setCreateOpen(true)}
                            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                        >
                            <AddIcon fontSize="small" />
                            Yeni
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} variant="rectangular" height={48} sx={{ borderRadius: 1 }} />
                    ))}
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-center">
                    <ErrorOutlineIcon className="text-red-500 mb-2" style={{ fontSize: 40 }} />
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{error}</p>
                </div>
            ) : rows.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-center">
                    <p className="text-gray-600 dark:text-gray-300">Heç bir qeyd tapılmadı</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900/40">
                            <tr className="text-left text-gray-600 dark:text-gray-300">
                                <th className="px-4 py-2 font-medium w-32">{codeLabel}</th>
                                <th className="px-4 py-2 font-medium">{nameLabel}</th>
                                {extraColumns?.map((col) => (
                                    <th key={col.key} className="px-4 py-2 font-medium">{col.label}</th>
                                ))}
                                <th className="px-4 py-2 font-medium w-32 text-right">Əməliyyatlar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/40"
                                >
                                    <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{row.code}</td>
                                    <td className="px-4 py-2 text-gray-900 dark:text-white">{row.name}</td>
                                    {extraColumns?.map((col) => (
                                        <td key={col.key} className="px-4 py-2 text-gray-700 dark:text-gray-200">
                                            {col.render(row)}
                                        </td>
                                    ))}
                                    <td className="px-4 py-2">
                                        <div className="flex items-center justify-end gap-2">
                                            {canEdit && onUpdate && (
                                                <button
                                                    title="Redaktə et"
                                                    onClick={() => setEditRow(row)}
                                                    className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                                                >
                                                    <EditIcon fontSize="small" />
                                                </button>
                                            )}
                                            {canDelete && onDelete && (
                                                <button
                                                    title="Sil"
                                                    onClick={() => setDeleteRow(row)}
                                                    className="p-1.5 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={!!editRow} onClose={() => { setEditRow(null); setFeedback(""); }} className="max-w-md mx-auto">
                <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title} - Redaktə</h4>
                    <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{nameLabel}</label>
                    <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {editExtraFields?.map((f) => (
                        <div key={f.key} className="mt-3">
                            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{f.label}</label>
                            <select
                                value={editExtraValues[f.key] ?? ""}
                                onChange={(e) =>
                                    setEditExtraValues((prev) => ({ ...prev, [f.key]: e.target.value }))
                                }
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {f.options.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                    {feedback && <p className="mt-2 text-sm text-red-600">{feedback}</p>}
                    <div className="mt-5 flex justify-end gap-2">
                        <button
                            onClick={() => { setEditRow(null); setFeedback(""); }}
                            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                        >
                            Ləğv et
                        </button>
                        <button
                            onClick={handleUpdate}
                            disabled={busy || !editValue.trim()}
                            className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            {busy ? "Yadda saxlanır..." : "Yadda saxla"}
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={!!deleteRow} onClose={() => { setDeleteRow(null); setFeedback(""); }} className="max-w-md mx-auto">
                <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Silməyi təsdiqlə</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium text-gray-900 dark:text-white">{deleteRow?.name}</span> silinsin?
                    </p>
                    {feedback && <p className="mt-2 text-sm text-red-600">{feedback}</p>}
                    <div className="mt-5 flex justify-end gap-2">
                        <button
                            onClick={() => { setDeleteRow(null); setFeedback(""); }}
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

            <Modal isOpen={createOpen} onClose={() => { setCreateOpen(false); setFeedback(""); }} className="max-w-md mx-auto">
                <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title} - Yeni</h4>
                    <div className="space-y-3">
                        {(createFields ?? [{ key: "name", label: nameLabel }]).map((f) => (
                            <div key={f.key}>
                                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{f.label}</label>
                                <input
                                    type={f.type ?? "text"}
                                    value={createValues[f.key] ?? ""}
                                    onChange={(e) =>
                                        setCreateValues((prev) => ({ ...prev, [f.key]: e.target.value }))
                                    }
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        ))}
                    </div>
                    {feedback && <p className="mt-2 text-sm text-red-600">{feedback}</p>}
                    <div className="mt-5 flex justify-end gap-2">
                        <button
                            onClick={() => { setCreateOpen(false); setFeedback(""); }}
                            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                        >
                            Ləğv et
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={busy}
                            className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            {busy ? "Əlavə olunur..." : "Əlavə et"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
