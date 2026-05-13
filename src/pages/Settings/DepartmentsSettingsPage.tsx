import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import CrudTable, { CrudRow } from "../../components/settings/CrudTable";
import AdminGuard from "./AdminGuard";
import {
    Department,
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
} from "../../services/department/departmentService";

export default function DepartmentsSettingsPage() {
    const token = useSelector((s: RootState) => s.auth.token);
    const [rows, setRows] = useState<CrudRow[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        const data = await getDepartments(token);
        const items: Department[] = Array.isArray(data) ? data : [];
        setRows(items.map((d) => ({ id: d.id, code: d.department_code, name: d.department_name })));
        setLoading(false);
    }, [token]);

    useEffect(() => {
        load();
    }, [load]);

    return (
        <AdminGuard>
            <PageMeta title="Şöbələr | Tənzimləmələr" description="Şöbələrin idarə olunması" />
            <PageBreadcrumb pageTitle="Şöbələr" />
            <ComponentCard title="Şöbələr">
                <CrudTable
                    title=""
                    rows={rows}
                    loading={loading}
                    canCreate
                    createFields={[
                        { key: "code", label: "Şöbə kodu" },
                        { key: "name", label: "Şöbə adı" }
                    ]}
                    nameLabel="Şöbə adı"
                    onRefresh={load}
                    onCreate={async (values) => {
                        const code = (values.code ?? "").trim();
                        const name = (values.name ?? "").trim();
                        if (!code || !name) return { ok: false, message: "Kod və ad boş ola bilməz" };
                        const res = await createDepartment(code, name, token);
                        if (res?.statusCode === 201) return { ok: true };
                        return { ok: false, message: res?.message ?? "Xəta" };
                    }}
                    onUpdate={async (row, newName) => {
                        const res = await updateDepartment(String(row.code), newName, token);
                        if (res?.statusCode === 200) return { ok: true };
                        return { ok: false, message: res?.message ?? "Xəta" };
                    }}
                    onDelete={async (row) => {
                        const res = await deleteDepartment(String(row.code), token);
                        if (res?.statusCode === 200) return { ok: true };
                        return { ok: false, message: res?.message ?? "Xəta" };
                    }}
                />
            </ComponentCard>
        </AdminGuard>
    );
}
