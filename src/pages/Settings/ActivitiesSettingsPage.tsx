import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import CrudTable, { CrudRow } from "../../components/settings/CrudTable";
import AdminGuard from "./AdminGuard";
import {
    Activity,
    createActivity,
    deleteActivity,
    getAllActivities,
    updateActivity
} from "../../services/activity/activityService";

export default function ActivitiesSettingsPage() {
    const token = useSelector((s: RootState) => s.auth.token);
    const fin_kod = useSelector((s: RootState) => s.auth.fin_kod);
    const [rows, setRows] = useState<CrudRow[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        const data = await getAllActivities(fin_kod ?? "", token);
        const items: Activity[] = Array.isArray(data) ? data : [];
        setRows(
            items.map((a) => ({
                id: a.id,
                code: a.actvity_type_code,
                name: a.activity_type_name
            }))
        );
        setLoading(false);
    }, [fin_kod, token]);

    useEffect(() => {
        load();
    }, [load]);

    return (
        <AdminGuard>
            <PageMeta
                title="Aktivlik növləri | Tənzimləmələr"
                description="Aktivlik növlərinin idarə olunması"
            />
            <PageBreadcrumb pageTitle="Aktivlik növləri" />
            <ComponentCard title="Aktivlik növləri">
                <CrudTable
                    title=""
                    rows={rows}
                    loading={loading}
                    canCreate
                    createFields={[{ key: "name", label: "Aktivlik adı" }]}
                    onRefresh={load}
                    onCreate={async (values) => {
                        const name = (values.name ?? "").trim();
                        if (!name) return { ok: false, message: "Ad boş ola bilməz" };
                        if (!fin_kod) return { ok: false, message: "İstifadəçi tapılmadı" };
                        const res = await createActivity(name, fin_kod, token ?? "");
                        if (typeof res === "object" && (res as any).status === "SUCCESS") {
                            return { ok: true };
                        }
                        if (res === "ACTIVITY EXISTS") {
                            return { ok: false, message: "Bu adla aktivlik artıq mövcuddur" };
                        }
                        return { ok: false, message: "Xəta baş verdi" };
                    }}
                    onUpdate={async (row, newName) => {
                        const res = await updateActivity(Number(row.code), newName, token);
                        if (res?.statusCode === 200) return { ok: true };
                        return { ok: false, message: res?.message ?? "Xəta" };
                    }}
                    onDelete={async (row) => {
                        const res = await deleteActivity(Number(row.code), token);
                        if (res?.statusCode === 200) return { ok: true };
                        return { ok: false, message: res?.message ?? "Xəta" };
                    }}
                />
            </ComponentCard>
        </AdminGuard>
    );
}
