import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import CrudTable, { CrudRow } from "../../components/settings/CrudTable";
import AdminGuard from "./AdminGuard";
import {
    Duty,
    OrgType,
    getDuties,
    createDuty,
    updateDuty,
    deleteDuty
} from "../../services/duty/duty";

export default function DutiesSettingsPage() {
    const token = useSelector((s: RootState) => s.auth.token);
    const [orgType, setOrgType] = useState<OrgType>("faculty");
    const [rows, setRows] = useState<CrudRow[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        const data = await getDuties(token, orgType);
        const items: Duty[] = Array.isArray(data) ? data : [];
        setRows(
            items.map((d) => ({
                id: d.id,
                code: d.duty_code,
                name: d.duty_name,
                org_type: d.org_type ?? "faculty"
            }))
        );
        setLoading(false);
    }, [token, orgType]);

    useEffect(() => {
        load();
    }, [load]);

    return (
        <AdminGuard>
            <PageMeta title="Vəzifələr | Tənzimləmələr" description="Vəzifələrin idarə olunması" />
            <PageBreadcrumb pageTitle="Vəzifələr" />
            <ComponentCard title="Vəzifələr">
                <CrudTable
                    title=""
                    rows={rows}
                    loading={loading}
                    canCreate
                    createFields={[{ key: "name", label: orgType === "faculty" ? "Fakültə vəzifəsi adı" : "Şöbə vəzifəsi adı" }]}
                    nameLabel={orgType === "faculty" ? "Fakültə vəzifəsi" : "Şöbə vəzifəsi"}
                    extraColumns={[
                        {
                            key: "org_type",
                            label: "Səviyyə",
                            render: (row) => {
                                const v = String(row.org_type ?? "faculty");
                                const isFac = v === "faculty";
                                return (
                                    <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                            isFac
                                                ? "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                                                : "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300"
                                        }`}
                                    >
                                        {isFac ? "Fakültə" : "Şöbə"}
                                    </span>
                                );
                            }
                        }
                    ]}
                    editExtraFields={[
                        {
                            key: "org_type",
                            label: "Səviyyə",
                            type: "select",
                            options: [
                                { value: "faculty", label: "Fakültə" },
                                { value: "department", label: "Şöbə" }
                            ]
                        }
                    ]}
                    getInitialEditExtra={(row) => ({ org_type: String(row.org_type ?? "faculty") })}
                    onRefresh={load}
                    headerExtra={
                        <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-sm">
                            <button
                                type="button"
                                onClick={() => setOrgType("faculty")}
                                className={`px-3 py-2 ${orgType === "faculty" ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"}`}
                            >
                                Fakültə
                            </button>
                            <button
                                type="button"
                                onClick={() => setOrgType("department")}
                                className={`px-3 py-2 ${orgType === "department" ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"}`}
                            >
                                Şöbə
                            </button>
                        </div>
                    }
                    onCreate={async (values) => {
                        const name = (values.name ?? "").trim();
                        if (!name) return { ok: false, message: "Ad boş ola bilməz" };
                        const res = await createDuty(name, token, orgType);
                        if (res?.statusCode === 201) return { ok: true };
                        return { ok: false, message: res?.message ?? "Xəta" };
                    }}
                    onUpdate={async (row, newName, extra) => {
                        const newOrg = (extra?.org_type as OrgType) ?? (row.org_type as OrgType) ?? "faculty";
                        const res = await updateDuty(Number(row.code), newName, token, newOrg);
                        if (res?.statusCode === 200) return { ok: true };
                        return { ok: false, message: res?.message ?? "Xəta" };
                    }}
                    onDelete={async (row) => {
                        const res = await deleteDuty(Number(row.code), token);
                        if (res?.statusCode === 200) return { ok: true };
                        return { ok: false, message: res?.message ?? "Xəta" };
                    }}
                />
            </ComponentCard>
        </AdminGuard>
    );
}
