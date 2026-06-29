import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Skeleton from "@mui/material/Skeleton";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { RootState } from "../../redux/store";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { AppComment, getMyComments } from "../../services/comment/comment";

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

function TargetBadge({ c }: { c: AppComment }) {
    if (c.target_type === "user") {
        return (
            <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
                Ümumi
            </span>
        );
    }
    const label = c.target_type === "plan" ? "Plan" : "Hesabat";
    return (
        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-700 ring-1 ring-inset ring-gray-200 dark:bg-white/5 dark:text-gray-300 dark:ring-white/10">
            {label} #{c.target_ref}
        </span>
    );
}

export default function MyCommentsPage() {
    const token = useSelector((s: RootState) => s.auth.token);
    const [rows, setRows] = useState<AppComment[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        setRows(await getMyComments(token));
        setLoading(false);
    }, [token]);

    useEffect(() => {
        load();
    }, [load]);

    return (
        <>
            <PageMeta title="Şərhlər" description="Plan və hesabatlarınıza yazılan şərhlər" />
            <PageBreadcrumb pageTitle="Şərhlər" />
            <ComponentCard
                title="Şərhlər"
                desc="Administrator tərəfindən plan və hesabatlarınıza yazılan bütün şərhlər"
            >
                {loading ? (
                    <div className="space-y-2">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} variant="rectangular" height={72} sx={{ borderRadius: 1 }} />
                        ))}
                    </div>
                ) : rows.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-center">
                        <ChatBubbleOutlineIcon className="text-gray-400 mb-2" style={{ fontSize: 40 }} />
                        <p className="text-gray-600 dark:text-gray-300">Hələ heç bir şərh yoxdur</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {rows.map((c) => (
                            <div
                                key={c.id}
                                className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 p-4"
                            >
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                    <TargetBadge c={c} />
                                    <span className="ml-auto text-xs text-gray-400">
                                        {formatDate(c.created_at)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                                    {c.comment}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </ComponentCard>
        </>
    );
}
