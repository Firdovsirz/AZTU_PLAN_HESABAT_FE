import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import { RootState } from "../../redux/store";
import SchoolIcon from "@mui/icons-material/School";
import SearchIcon from "@mui/icons-material/Search";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { getCafedrasByFaculty, Cafedra } from "../../services/cafedra/cafedraService";

export default function MyCafedras() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [cafedras, setCafedras] = useState<Cafedra[]>([]);
    const [query, setQuery] = useState("");
    const facultyCode = useSelector((state: RootState) => state.auth.faculty_code);
    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
        if (facultyCode) {
            getCafedrasByFaculty(facultyCode, token ? token : '')
                .then((res) => {
                    if (res === "NOT FOUND") {
                        setNotFound(true);
                    } else {
                        setCafedras(res.cafedras);
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err);
                });
        }
    }, []);

    const filtered = cafedras.filter((c) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
            c.cafedra_name.toLowerCase().includes(q) ||
            String(c.cafedra_code).toLowerCase().includes(q)
        );
    });

    const cafedraCount = cafedras.length;

    const Header = (
        <div className="relative overflow-hidden rounded-3xl border border-white/30 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-6 sm:p-8 shadow-[0_30px_80px_-30px_rgba(70,95,255,0.55)]">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-20 -right-16 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-20 -left-10 h-60 w-60 rounded-full bg-blue-light-400/20 blur-3xl" />
                <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                        backgroundSize: "22px 22px",
                    }}
                />
            </div>
            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex flex-col gap-3 max-w-2xl">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur">
                        <SchoolIcon sx={{ fontSize: 14 }} />
                        Fakültə
                    </span>
                    <h1 className="text-2xl font-semibold leading-tight text-white sm:text-3xl">
                        Kafedralarım
                    </h1>
                    <p className="text-sm text-white/80">
                        Fakültənizə bağlı kafedraların siyahısı və sürətli keçid.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur">
                        <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
                            Ümumi say
                        </div>
                        <div className="mt-1 text-3xl font-semibold text-white">
                            {cafedraCount}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const SearchBar = (
        <div className="relative mt-6">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" sx={{ fontSize: 20 }} />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Kafedra adı və ya kodu ilə axtarış..."
                className="h-12 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 text-sm shadow-sm shadow-gray-900/[0.02] transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-brand-400 focus:outline-hidden focus:ring-4 focus:ring-brand-500/15 dark:border-gray-700/70 dark:bg-gray-900/60 dark:text-white/90"
            />
        </div>
    );

    if (loading) {
        return (
            <>
                {Header}
                {SearchBar}
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <Skeleton
                            key={item}
                            variant="rectangular"
                            height={120}
                            sx={{ borderRadius: 3 }}
                        />
                    ))}
                </div>
            </>
        );
    }

    if (notFound) {
        return (
            <>
                {Header}
                <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/60 py-16 dark:border-gray-700 dark:bg-white/[0.02]">
                    <SchoolIcon sx={{ fontSize: 48 }} className="text-gray-300" />
                    <p className="mt-4 text-base font-medium text-gray-700 dark:text-gray-300">
                        Heç bir kafedra tapılmadı
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        Fakültənizə bağlı qeydiyyatda olan kafedra yoxdur.
                    </p>
                </div>
            </>
        );
    }

    if (error.length !== 0) {
        return (
            <>
                {Header}
                <div className="mt-6 rounded-2xl border border-error-200 bg-error-50 px-5 py-4 text-sm text-error-700 dark:border-error-500/40 dark:bg-error-500/10 dark:text-error-300">
                    {error}
                </div>
            </>
        );
    }

    const palette = [
        "from-brand-500 to-brand-700",
        "from-blue-light-500 to-blue-light-700",
        "from-theme-purple-500 to-brand-700",
        "from-orange-500 to-error-600",
        "from-success-500 to-success-700",
        "from-warning-500 to-orange-600",
    ];

    return (
        <>
            {Header}
            {SearchBar}

            {filtered.length === 0 ? (
                <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/60 py-16 dark:border-gray-700 dark:bg-white/[0.02]">
                    <SearchIcon sx={{ fontSize: 40 }} className="text-gray-300" />
                    <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                        Axtarışa uyğun nəticə yoxdur
                    </p>
                </div>
            ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((cafedra, index) => {
                        const gradient = palette[index % palette.length];
                        const initials = cafedra.cafedra_name
                            .split(" ")
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((w) => w[0])
                            .join("")
                            .toUpperCase();
                        return (
                            <Link
                                key={cafedra.cafedra_code}
                                to={`/cafedra/${cafedra.cafedra_code}`}
                                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-500/10 hover:border-brand-200 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-500/30"
                            >
                                <div
                                    className={`pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-25`}
                                />
                                <div className="relative flex items-start gap-4">
                                    <div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-sm font-semibold text-white shadow-lg shadow-brand-500/20 ring-1 ring-white/20`}
                                    >
                                        {initials || <SchoolIcon sx={{ fontSize: 20 }} />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-gray-900 transition-colors group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
                                            {cafedra.cafedra_name}
                                        </h3>
                                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600 ring-1 ring-inset ring-gray-200/80 dark:bg-white/5 dark:text-gray-400 dark:ring-white/10">
                                            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                                            Kod: {cafedra.cafedra_code}
                                        </div>
                                    </div>
                                </div>

                                <div className="relative mt-5 flex items-center justify-between border-t border-dashed border-gray-200 pt-4 dark:border-gray-700/60">
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                        Ətraflı bax
                                    </span>
                                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-all duration-300 group-hover:border-brand-500 group-hover:bg-brand-500 group-hover:text-white dark:border-gray-700">
                                        <ArrowOutwardIcon sx={{ fontSize: 16 }} />
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </>
    );
}
