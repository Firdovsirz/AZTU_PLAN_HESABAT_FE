import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { RootState } from "../../redux/store";
import Skeleton from "@mui/material/Skeleton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow
} from "../ui/table";
import {
    CafedraPlanHesabatItem,
    CafedraPlansHesabatsResponse,
    getCafedraPlansHesabats
} from "../../services/cafedra/cafedraService";
import {
    DepartmentPlansHesabatsResponse,
    getDepartmentPlansHesabats
} from "../../services/department/departmentService";

type UnitKind = "cafedra" | "department";

interface UnifiedHeader {
    kind: UnitKind;
    code: string;
    name: string;
    faculty_code?: string;
    faculty_name?: string | null;
}

export default function CafedraPlansDetails() {
    const params = useParams<{ cafedra_code?: string; unit_type?: string; unit_code?: string }>();
    const navigate = useNavigate();
    const token = useSelector((state: RootState) => state.auth.token);
    const role = useSelector((state: RootState) => state.auth.role);

    const unitKind: UnitKind = params.unit_type === "department" ? "department" : "cafedra";
    const unitCode = params.unit_code || params.cafedra_code || "";

    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [header, setHeader] = useState<UnifiedHeader | null>(null);
    const [items, setItems] = useState<CafedraPlanHesabatItem[]>([]);
    const [activityFilter, setActivityFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        if (!unitCode || role !== 1) return;
        let cancelled = false;
        setLoading(true);
        setNotFound(false);
        const fetcher = unitKind === "department"
            ? getDepartmentPlansHesabats(unitCode, token)
            : getCafedraPlansHesabats(unitCode, token);
        fetcher
            .then((res) => {
                if (cancelled) return;
                if (res === "NOT FOUND") {
                    setNotFound(true);
                    setHeader(null);
                    setItems([]);
                } else if (res === "ERROR") {
                    setHeader(null);
                    setItems([]);
                } else if (unitKind === "department") {
                    const d = res as DepartmentPlansHesabatsResponse;
                    setHeader({
                        kind: "department",
                        code: d.department_code,
                        name: d.department_name
                    });
                    setItems(d.items as unknown as CafedraPlanHesabatItem[]);
                } else {
                    const c = res as CafedraPlansHesabatsResponse;
                    setHeader({
                        kind: "cafedra",
                        code: c.cafedra_code,
                        name: c.cafedra_name,
                        faculty_code: c.faculty_code,
                        faculty_name: c.faculty_name
                    });
                    setItems(c.items);
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [unitCode, unitKind, token, role]);

    const activityOptions = useMemo(() => {
        const set = new Set<string>();
        items.forEach((it) => {
            it.activity_type_names.forEach((n) => {
                if (n) set.add(n);
            });
        });
        return Array.from(set).sort();
    }, [items]);

    const filteredItems: CafedraPlanHesabatItem[] = useMemo(() => {
        const q = search.trim().toLowerCase();
        return items.filter((it) => {
            if (activityFilter && !it.activity_type_names.includes(activityFilter)) return false;
            if (statusFilter === "submitted" && !it.is_submitted) return false;
            if (statusFilter === "pending" && it.is_submitted) return false;
            if (statusFilter === "done" && !it.is_done) return false;
            if (!q) return true;
            const fullName = `${it.name || ""} ${it.surname || ""} ${it.father_name || ""}`.toLowerCase();
            return (
                fullName.includes(q) ||
                it.fin_kod?.toLowerCase().includes(q) ||
                it.work_plan_serial_number?.toLowerCase().includes(q) ||
                (it.work_desc || "").toLowerCase().includes(q)
            );
        });
    }, [items, activityFilter, statusFilter, search]);

    if (role !== 1) {
        return (
            <div className="flex flex-col items-center justify-center p-6 mt-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-center">
                <ErrorOutlineIcon className="text-red-500 dark:text-red-400 mb-2" style={{ fontSize: 40 }} />
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                    Bu səhifəyə baxmaq üçün icazəniz yoxdur
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(6)].map((_, idx) => (
                    <Skeleton key={idx} variant="rounded" height={48} />
                ))}
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="w-full flex justify-center items-center p-6 text-gray-600 dark:text-gray-300">
                Kafedra tapılmadı
            </div>
        );
    }

    if (!header) {
        return (
            <div className="w-full flex justify-center items-center p-6 text-gray-600 dark:text-gray-300">
                Məlumat yüklənmədi
            </div>
        );
    }

    return (
        <div>
            <div className="mb-5 p-4 rounded-lg border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                    {header.kind === "department" ? "Struktur bölmə" : "Kafedra"}: {header.name} ({header.code})
                </p>
                {header.kind === "cafedra" && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        Fakültə: {header.faculty_name || "-"} ({header.faculty_code || "-"})
                    </p>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-3 mb-5">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Ad, FİN, plan nömrəsi və ya təsvir üzrə axtarış"
                    className="w-full lg:w-1/3 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                />
                <select
                    value={activityFilter}
                    onChange={(e) => setActivityFilter(e.target.value)}
                    className="w-full lg:w-1/3 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                >
                    <option value="">Bütün fəaliyyət növləri</option>
                    {activityOptions.map((a) => (
                        <option key={a} value={a}>
                            {a}
                        </option>
                    ))}
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full lg:w-1/3 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                >
                    <option value="">Bütün statuslar</option>
                    <option value="pending">İcradadır</option>
                    <option value="submitted">Təhvil verilib</option>
                    <option value="done">Tamamlanıb</option>
                </select>
            </div>

            {filteredItems.length === 0 ? (
                <div className="w-full flex justify-center items-center p-6 text-gray-600 dark:text-gray-300">
                    Heç bir plan və ya hesabat tapılmadı
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        Plan nömrəsi
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        Fəaliyyət növləri
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        Məqsəd
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        İl
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        Status
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        Əməliyyatlar
                                    </TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {filteredItems.map((it) => {
                                    const names = it.activity_type_names.filter(Boolean) as string[];
                                    return (
                                        <TableRow key={it.work_plan_serial_number}>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {it.work_plan_serial_number}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {names[0] || "-"}
                                                {names.length > 1 && (
                                                    <span className="text-center bg-green-200 dark:bg-green-600 text-green-900 dark:text-green-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                        +{names.length - 1}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {it.work_desc || "-"}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {it.work_year}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {it.is_done ? (
                                                    <p className="text-center bg-blue-200 dark:bg-blue-600 text-blue-900 dark:text-blue-100 px-2 py-1 rounded-[20px] inline-block">
                                                        Tamamlanıb
                                                    </p>
                                                ) : it.is_submitted ? (
                                                    <p className="text-center bg-green-200 dark:bg-green-600 text-green-900 dark:text-green-100 px-2 py-1 rounded-[20px] inline-block">
                                                        Təhvil verilib
                                                    </p>
                                                ) : (
                                                    <p className="text-center bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block">
                                                        İcradadır
                                                    </p>
                                                )}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        onClick={() =>
                                                            navigate("/my-plan-details", {
                                                                state: it.work_plan_serial_number
                                                            })
                                                        }
                                                        title="Plan"
                                                        className="inline-flex items-center justify-center w-10 h-10 rounded-[5px] bg-yellow-200 dark:bg-yellow-400 cursor-pointer"
                                                    >
                                                        <VisibilityIcon className="text-yellow-500 dark:text-yellow-700" />
                                                    </div>
                                                    <div
                                                        onClick={() =>
                                                            navigate("/my-hesabat-details", {
                                                                state: it.work_plan_serial_number
                                                            })
                                                        }
                                                        title="Hesabat"
                                                        className="inline-flex items-center justify-center w-10 h-10 rounded-[5px] bg-blue-600 dark:bg-blue-600 cursor-pointer"
                                                    >
                                                        <ArrowOutwardIcon className="text-white dark:text-white" />
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}
        </div>
    );
}
