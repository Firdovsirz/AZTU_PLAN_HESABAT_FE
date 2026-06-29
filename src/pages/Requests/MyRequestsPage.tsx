import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Skeleton from "@mui/material/Skeleton";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { RootState } from "../../redux/store";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import {
    UserRequest,
    getMyRequests,
} from "../../services/request/request";
import {
    StatusBadge,
    TypeBadge,
    TargetBadge,
    ProposedChangesList,
    formatDate,
} from "../../components/requests/requestUi";

export default function MyRequestsPage() {
    const token = useSelector((s: RootState) => s.auth.token);
    const [rows, setRows] = useState<UserRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        const data = await getMyRequests(token);
        setRows(data);
        setLoading(false);
    }, [token]);

    useEffect(() => {
        load();
    }, [load]);

    return (
        <>
            <PageMeta title="Sorğularım" description="Redaktə və silmə sorğularım" />
            <PageBreadcrumb pageTitle="Sorğularım" />
            <ComponentCard
                title="Sorğularım"
                desc="Plan və hesabatlarınız üçün admin-ə göndərdiyiniz redaktə/silmə sorğuları"
            >
                {loading ? (
                    <div className="space-y-2">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} variant="rectangular" height={64} sx={{ borderRadius: 1 }} />
                        ))}
                    </div>
                ) : rows.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-center">
                        <ErrorOutlineIcon className="text-gray-400 mb-2" style={{ fontSize: 40 }} />
                        <p className="text-gray-600 dark:text-gray-300">Hələ heç bir sorğunuz yoxdur</p>
                        <p className="mt-1 text-sm text-gray-500">
                            Sorğu yaratmaq üçün "Planım" və ya "Hesabatım" səhifəsindəki redaktə/silmə düymələrindən istifadə edin.
                        </p>
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
                                            Rədd edilmə səbəbi
                                        </p>
                                        <p className="text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap break-words">
                                            {r.reject_note}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </ComponentCard>
        </>
    );
}
