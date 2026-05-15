import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import CrudTable, { CrudRow } from "../../components/settings/CrudTable";
import AdminGuard from "./AdminGuard";
import {
    Cafedra,
    getAllCafedras,
    createCafedra,
    updateCafedra,
    deleteCafedra
} from "../../services/cafedra/cafedraService";
import { Faculty, getFaculties } from "../../services/faculty/facultyService";

export default function CafedrasSettingsPage() {
    const token = useSelector((s: RootState) => s.auth.token);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [facultyCode, setFacultyCode] = useState<string>("");
    const [rows, setRows] = useState<CrudRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const data = await getFaculties(token);
            const items: Faculty[] = Array.isArray(data) ? data : [];
            setFaculties(items);
            if (items.length > 0 && !facultyCode) {
                setFacultyCode(items[0].faculty_code);
            }
        })();
    }, [token]);

    const load = useCallback(async () => {
        if (!facultyCode) {
            setRows([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        const data = await getAllCafedras(facultyCode, token);
        const items: Cafedra[] = Array.isArray(data) ? data : [];
        setRows(
            items.map((c, idx) => ({
                id: `${c.cafedra_code}-${idx}`,
                code: c.cafedra_code,
                name: c.cafedra_name
            }))
        );
        setLoading(false);
    }, [facultyCode, token]);

    useEffect(() => {
        load();
    }, [load]);

    return (
        <AdminGuard>
            <PageMeta title="Kafedralar | Tənzimləmələr" description="Kafedraların idarə olunması" />
            <PageBreadcrumb pageTitle="Kafedralar" />
            <ComponentCard title="Kafedralar">
                <CrudTable
                    title=""
                    rows={rows}
                    loading={loading}
                    canCreate={!!facultyCode}
                    codeLabel="Kafedra kodu"
                    nameLabel="Kafedra adı"
                    createFields={[
                        { key: "code", label: "Kafedra kodu" },
                        { key: "name", label: "Kafedra adı" }
                    ]}
                    onCreate={async (values) => {
                        const code = (values.code ?? "").trim();
                        const name = (values.name ?? "").trim();
                        if (!facultyCode) return { ok: false, message: "Fakültə seçin" };
                        if (!code || !name) return { ok: false, message: "Kod və ad mütləqdir" };
                        const res = await createCafedra(facultyCode, code, name, token);
                        if (res?.statusCode === 201) return { ok: true };
                        return { ok: false, message: res?.message ?? "Xəta" };
                    }}
                    onRefresh={load}
                    headerExtra={
                        <select
                            value={facultyCode}
                            onChange={(e) => setFacultyCode(e.target.value)}
                            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                        >
                            {faculties.map((f) => (
                                <option key={f.faculty_code} value={f.faculty_code}>
                                    {f.faculty_name}
                                </option>
                            ))}
                        </select>
                    }
                    onUpdate={async (row, newName) => {
                        const res = await updateCafedra(String(row.code), newName, token);
                        if (res?.statusCode === 200) return { ok: true };
                        return { ok: false, message: res?.message ?? "Xəta" };
                    }}
                    onDelete={async (row) => {
                        const res = await deleteCafedra(String(row.code), token);
                        if (res?.statusCode === 200) return { ok: true };
                        return { ok: false, message: res?.message ?? "Xəta" };
                    }}
                />
            </ComponentCard>
        </AdminGuard>
    );
}
