import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { RootState } from "../../redux/store";
import Skeleton from "@mui/material/Skeleton";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import SchoolIcon from "@mui/icons-material/School";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Faculty, getFaculties } from "../../services/faculty/facultyService";
import { Cafedra, getCafedrasByFaculty } from "../../services/cafedra/cafedraService";

interface CafedraRow extends Cafedra {
    faculty_name: string;
}

export default function CafedraPlansCards() {
    const token = useSelector((state: RootState) => state.auth.token);
    const role = useSelector((state: RootState) => state.auth.role);

    const [loading, setLoading] = useState(true);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [cafedras, setCafedras] = useState<CafedraRow[]>([]);
    const [facultyFilter, setFacultyFilter] = useState<string>("");
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        if (role !== 1) return;
        let cancelled = false;
        setLoading(true);
        (async () => {
            try {
                const fac = (await getFaculties(token)) as Faculty[] | undefined;
                if (!fac || !Array.isArray(fac)) {
                    if (!cancelled) {
                        setFaculties([]);
                        setCafedras([]);
                        setLoading(false);
                    }
                    return;
                }
                if (cancelled) return;
                setFaculties(fac);
                const results = await Promise.all(
                    fac.map(async (f) => {
                        const r = await getCafedrasByFaculty(f.faculty_code, token || "");
                        if (r === "NOT FOUND") return [];
                        return r.cafedras.map((c) => ({
                            ...c,
                            faculty_code: c.faculty_code || f.faculty_code,
                            faculty_name: f.faculty_name
                        }));
                    })
                );
                if (cancelled) return;
                setCafedras(results.flat());
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
        return cafedras.filter((c) => {
            if (facultyFilter && c.faculty_code !== facultyFilter) return false;
            if (!q) return true;
            return (
                c.cafedra_name?.toLowerCase().includes(q) ||
                c.cafedra_code?.toLowerCase().includes(q) ||
                c.faculty_name?.toLowerCase().includes(q)
            );
        });
    }, [cafedras, facultyFilter, search]);

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
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Kafedra adı və ya kodu üzrə axtarış"
                    className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                />
                <select
                    value={facultyFilter}
                    onChange={(e) => setFacultyFilter(e.target.value)}
                    className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                >
                    <option value="">Bütün fakültələr</option>
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
                    Kafedra tapılmadı
                </div>
            ) : (
                <div className="flex flex-wrap -mx-2">
                    {filtered.map((c) => (
                        <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4" key={c.cafedra_code}>
                            <Link
                                to={`/cafedra-plans/${c.cafedra_code}`}
                                className="group flex items-start justify-between p-4 rounded-lg bg-blue-600 border-2 border-blue-600 cursor-pointer transition-colors duration-300 hover:bg-transparent hover:border-blue-600 h-full"
                            >
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-2">
                                        <SchoolIcon className="text-white group-hover:text-blue-600" />
                                        <p className="text-white group-hover:text-blue-600 text-lg break-words">
                                            {c.cafedra_name}
                                        </p>
                                    </div>
                                    <p className="text-white/80 group-hover:text-blue-600 text-sm">
                                        Kod: {c.cafedra_code}
                                    </p>
                                    <p className="text-white/80 group-hover:text-blue-600 text-sm">
                                        Fakültə: {c.faculty_name}
                                    </p>
                                </div>
                                <ArrowOutwardIcon className="text-white group-hover:text-blue-600" />
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
