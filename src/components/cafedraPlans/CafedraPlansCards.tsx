import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { RootState } from "../../redux/store";
import Skeleton from "@mui/material/Skeleton";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import SchoolIcon from "@mui/icons-material/School";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Faculty, getFaculties } from "../../services/faculty/facultyService";
import { Cafedra, getCafedrasByFaculty } from "../../services/cafedra/cafedraService";
import { Department, getDepartments } from "../../services/department/departmentService";

type UnitKind = "cafedra" | "department";

interface UnitRow {
    kind: UnitKind;
    code: string;
    name: string;
    faculty_code: string | null;
    faculty_name: string | null;
}

export default function CafedraPlansCards() {
    const token = useSelector((state: RootState) => state.auth.token);
    const role = useSelector((state: RootState) => state.auth.role);

    const [loading, setLoading] = useState(true);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [units, setUnits] = useState<UnitRow[]>([]);
    const [facultyFilter, setFacultyFilter] = useState<string>("");
    const [kindFilter, setKindFilter] = useState<"" | UnitKind>("");
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        if (role !== 1) return;
        let cancelled = false;
        setLoading(true);
        (async () => {
            try {
                const [facRes, depRes] = await Promise.all([
                    getFaculties(token) as Promise<Faculty[] | undefined>,
                    getDepartments(token) as Promise<Department[]>
                ]);
                const fac = Array.isArray(facRes) ? facRes : [];
                if (cancelled) return;
                setFaculties(fac);

                const cafedraResults = await Promise.all(
                    fac.map(async (f) => {
                        const r = await getCafedrasByFaculty(f.faculty_code, token || "");
                        if (r === "NOT FOUND") return [] as UnitRow[];
                        return r.cafedras.map<UnitRow>((c: Cafedra) => ({
                            kind: "cafedra",
                            code: c.cafedra_code,
                            name: c.cafedra_name,
                            faculty_code: c.faculty_code || f.faculty_code,
                            faculty_name: f.faculty_name
                        }));
                    })
                );

                const departmentUnits: UnitRow[] = (depRes || []).map((d) => ({
                    kind: "department",
                    code: d.department_code,
                    name: d.department_name,
                    faculty_code: null,
                    faculty_name: null
                }));

                if (cancelled) return;
                setUnits([...cafedraResults.flat(), ...departmentUnits]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [token, role]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return units.filter((u) => {
            if (kindFilter && u.kind !== kindFilter) return false;
            if (facultyFilter) {
                if (u.kind !== "cafedra") return false;
                if (u.faculty_code !== facultyFilter) return false;
            }
            if (!q) return true;
            return (
                u.name?.toLowerCase().includes(q) ||
                u.code?.toLowerCase().includes(q) ||
                (u.faculty_name || "").toLowerCase().includes(q)
            );
        });
    }, [units, facultyFilter, kindFilter, search]);

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

    return (
        <div>
            <div className="flex flex-col lg:flex-row gap-3 mb-5">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Kafedra/struktur ad və ya kodu üzrə axtarış"
                    className="w-full lg:w-1/3 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                />
                <select
                    value={kindFilter}
                    onChange={(e) => setKindFilter(e.target.value as "" | UnitKind)}
                    className="w-full lg:w-1/3 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                >
                    <option value="">Hamısı (kafedralar və struktur bölmələr)</option>
                    <option value="cafedra">Yalnız kafedralar</option>
                    <option value="department">Yalnız struktur bölmələr</option>
                </select>
                <select
                    value={facultyFilter}
                    onChange={(e) => setFacultyFilter(e.target.value)}
                    className="w-full lg:w-1/3 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                >
                    <option value="">Bütün fakültələr (yalnız kafedralar üçün)</option>
                    {faculties.map((f) => (
                        <option key={f.faculty_code} value={f.faculty_code}>
                            {f.faculty_name}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="flex flex-wrap -mx-2">
                    {[...Array(6)].map((_, index) => (
                        <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4" key={index}>
                            <div className="p-4 rounded-lg bg-gray-200 border-2 border-gray-300">
                                <Skeleton variant="text" width="70%" height={28} sx={{ borderRadius: 1 }} />
                                <Skeleton variant="text" width="50%" height={20} sx={{ borderRadius: 1 }} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="w-full flex justify-center items-center p-6 text-gray-600 dark:text-gray-300">
                    Heç nə tapılmadı
                </div>
            ) : (
                <div className="flex flex-wrap -mx-2">
                    {filtered.map((u) => {
                        const isDept = u.kind === "department";
                        return (
                            <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4" key={`${u.kind}-${u.code}`}>
                                <Link
                                    to={`/cafedra-plans/${u.kind}/${u.code}`}
                                    className={`group flex items-start justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors duration-300 h-full ${
                                        isDept
                                            ? "bg-purple-600 border-purple-600 hover:bg-transparent hover:border-purple-600"
                                            : "bg-blue-600 border-blue-600 hover:bg-transparent hover:border-blue-600"
                                    }`}
                                >
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-2">
                                            {isDept ? (
                                                <ApartmentIcon
                                                    className={`text-white ${
                                                        isDept ? "group-hover:text-purple-600" : "group-hover:text-blue-600"
                                                    }`}
                                                />
                                            ) : (
                                                <SchoolIcon className="text-white group-hover:text-blue-600" />
                                            )}
                                            <p
                                                className={`text-white text-lg break-words ${
                                                    isDept ? "group-hover:text-purple-600" : "group-hover:text-blue-600"
                                                }`}
                                            >
                                                {u.name}
                                            </p>
                                        </div>
                                        <p
                                            className={`text-white/80 text-sm ${
                                                isDept ? "group-hover:text-purple-600" : "group-hover:text-blue-600"
                                            }`}
                                        >
                                            Növ: {isDept ? "Struktur bölmə" : "Kafedra"}
                                        </p>
                                        <p
                                            className={`text-white/80 text-sm ${
                                                isDept ? "group-hover:text-purple-600" : "group-hover:text-blue-600"
                                            }`}
                                        >
                                            Kod: {u.code}
                                        </p>
                                        {u.faculty_name && (
                                            <p className="text-white/80 group-hover:text-blue-600 text-sm">
                                                Fakültə: {u.faculty_name}
                                            </p>
                                        )}
                                    </div>
                                    <ArrowOutwardIcon
                                        className={`text-white ${
                                            isDept ? "group-hover:text-purple-600" : "group-hover:text-blue-600"
                                        }`}
                                    />
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
