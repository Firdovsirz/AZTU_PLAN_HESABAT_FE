import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import CrudTable, { CrudRow } from "../../components/settings/CrudTable";
import AdminGuard from "./AdminGuard";
import {
    Faculty,
    getFaculties,
    updateFaculty,
    deleteFaculty
} from "../../services/faculty/facultyService";

export default function FacultiesSettingsPage() {
    const token = useSelector((s: RootState) => s.auth.token);
    const [rows, setRows] = useState<CrudRow[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        const data = await getFaculties(token);
        const items: Faculty[] = Array.isArray(data) ? data : [];
        setRows(items.map((f) => ({ id: f.id, code: f.faculty_code, name: f.faculty_name })));
        setLoading(false);
    }, [token]);

    useEffect(() => {
        load();
    }, [load]);

    return (
        <AdminGuard>
            <PageMeta title="Fakültələr | Tənzimləmələr" description="Fakültələrin idarə olunması" />
            <PageBreadcrumb pageTitle="Fakültələr" />
            <ComponentCard title="Fakültələr">
                <CrudTable
                    title=""
                    rows={rows}
                    loading={loading}
                    canCreate={false}
                    nameLabel="Fakültə adı"
                    onRefresh={load}
                    onUpdate={async (row, newName) => {
                        const res = await updateFaculty(String(row.code), newName, token);
                        if (res?.statusCode === 200) return { ok: true };
                        return { ok: false, message: res?.message ?? "Xəta" };
                    }}
                    onDelete={async (row) => {
                        const res = await deleteFaculty(String(row.code), token);
                        if (res?.statusCode === 200) return { ok: true };
                        return { ok: false, message: res?.message ?? "Xəta" };
                    }}
                />
            </ComponentCard>
        </AdminGuard>
    );
}
