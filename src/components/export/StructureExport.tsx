import { ReactNode, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { RootState } from "../../redux/store";
import CircularProgress from "@mui/material/CircularProgress";
import SchoolIcon from "@mui/icons-material/School";
import ApartmentIcon from "@mui/icons-material/Apartment";
import TableViewIcon from "@mui/icons-material/TableView";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { Faculty, getFaculties } from "../../services/faculty/facultyService";
import { Cafedra, getCafedrasByFaculty } from "../../services/cafedra/cafedraService";
import { Department, getDepartments } from "../../services/department/departmentService";
import {
    ExportContent,
    ExportFormat,
    ExportScope,
    exportStructure
} from "../../services/export/exportService";

type IconType = typeof SchoolIcon;

const SCOPES: { value: ExportScope; label: string; hint: string; Icon: IconType }[] = [
    { value: "faculty", label: "Fakültə", hint: "Dekanlıq və fakültənin kafedraları", Icon: AccountBalanceIcon },
    { value: "cafedra", label: "Kafedra", hint: "Bir kafedranın bütün əməkdaşları", Icon: SchoolIcon },
    { value: "department", label: "Struktur bölmə", hint: "Şöbə, mərkəz və digər bölmələr", Icon: ApartmentIcon },
];

const CONTENTS: { value: ExportContent; label: string }[] = [
    { value: "all", label: "Planlar və hesabatlar" },
    { value: "plans", label: "Yalnız planlar" },
    { value: "reports", label: "Yalnız hesabatlar" },
];

const FORMATS: { value: ExportFormat; label: string; hint: string; Icon: IconType }[] = [
    { value: "pdf", label: "PDF", hint: "AzTU loqosu ilə rəsmi, çapa hazır sənəd", Icon: PictureAsPdfIcon },
    { value: "xlsx", label: "Excel", hint: "Süzgəc və təhlil üçün redaktə edilə bilən cədvəl", Icon: TableViewIcon },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 7 }, (_, i) => currentYear + 1 - i);

function Step({ step, title, children }: { step: number; title: string; children: ReactNode }) {
    return (
        <section>
            <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-semibold text-white shadow-sm shadow-brand-500/30">
                    {step}
                </span>
                <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">{title}</h4>
            </div>
            {children}
        </section>
    );
}

function OptionCard({ selected, onClick, Icon, label, hint }: {
    selected: boolean;
    onClick: () => void;
    Icon: IconType;
    label: string;
    hint: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={selected}
            className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 ${selected
                ? "border-brand-500 bg-brand-50/60 ring-4 ring-brand-500/10 dark:border-brand-400 dark:bg-brand-500/10"
                : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-white/[0.02] dark:hover:border-gray-700"
                }`}
        >
            <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${selected
                    ? "bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-500/30"
                    : "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400"
                    }`}
            >
                <Icon sx={{ fontSize: 20 }} />
            </span>
            <span className="min-w-0">
                <span className="block text-sm font-semibold text-gray-900 dark:text-white">{label}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-gray-500 dark:text-gray-400">{hint}</span>
            </span>
        </button>
    );
}

// Controlled counterpart of form/Select (that one keeps its own state, so it
// cannot be reset when the faculty changes).
function FieldSelect({ id, value, onChange, placeholder, options, disabled = false }: {
    id: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    options: { value: string; label: string }[];
    disabled?: boolean;
}) {
    return (
        <div className="relative w-full">
            <select
                id={id}
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                className={`h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-11 text-sm shadow-sm shadow-gray-900/[0.02] transition-all duration-200 hover:border-gray-300 focus:border-brand-400 focus:outline-hidden focus:ring-4 focus:ring-brand-500/15 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700/70 dark:bg-gray-900/60 dark:hover:border-gray-600 dark:focus:border-brand-500 ${value ? "text-gray-800 dark:text-white/90" : "text-gray-400 dark:text-gray-400"
                    }`}
            >
                <option value="" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                    {placeholder}
                </option>
                {options.map((o) => (
                    <option key={o.value} value={o.value} className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                        {o.label}
                    </option>
                ))}
            </select>
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </span>
        </div>
    );
}

export default function StructureExport() {
    const token = useSelector((state: RootState) => state.auth.token);

    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [cafedras, setCafedras] = useState<Cafedra[]>([]);
    const [loadingLists, setLoadingLists] = useState(true);
    const [loadingCafedras, setLoadingCafedras] = useState(false);

    const [scope, setScope] = useState<ExportScope>("faculty");
    const [facultyCode, setFacultyCode] = useState("");
    const [cafedraCode, setCafedraCode] = useState("");
    const [departmentCode, setDepartmentCode] = useState("");
    const [includeCafedras, setIncludeCafedras] = useState(true);
    const [content, setContent] = useState<ExportContent>("all");
    const [year, setYear] = useState<number | null>(null);
    const [format, setFormat] = useState<ExportFormat>("pdf");

    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

    useEffect(() => {
        let cancelled = false;
        Promise.all([
            (getFaculties(token) as Promise<Faculty[] | undefined>).catch(() => undefined),
            getDepartments(token)
        ])
            .then(([fac, dep]) => {
                if (cancelled) return;
                setFaculties(Array.isArray(fac) ? fac : []);
                setDepartments(dep);
            })
            .finally(() => {
                if (!cancelled) setLoadingLists(false);
            });
        return () => {
            cancelled = true;
        };
    }, [token]);

    // Kafedra scope: load the kafedras of the chosen faculty.
    useEffect(() => {
        setCafedraCode("");
        setCafedras([]);
        if (scope !== "cafedra" || !facultyCode) return;
        let cancelled = false;
        setLoadingCafedras(true);
        getCafedrasByFaculty(facultyCode, token || "")
            .then((res) => {
                if (!cancelled) setCafedras(res === "NOT FOUND" ? [] : res.cafedras);
            })
            .finally(() => {
                if (!cancelled) setLoadingCafedras(false);
            });
        return () => {
            cancelled = true;
        };
    }, [scope, facultyCode, token]);

    const code = scope === "faculty" ? facultyCode : scope === "cafedra" ? cafedraCode : departmentCode;

    const unitName = useMemo(() => {
        if (scope === "faculty") return faculties.find((f) => f.faculty_code === facultyCode)?.faculty_name;
        if (scope === "cafedra") return cafedras.find((c) => c.cafedra_code === cafedraCode)?.cafedra_name;
        return departments.find((d) => d.department_code === departmentCode)?.department_name;
    }, [scope, faculties, cafedras, departments, facultyCode, cafedraCode, departmentCode]);

    const facultyOptions = faculties.map((f) => ({ value: f.faculty_code, label: f.faculty_name }));

    const handleExport = async () => {
        if (!code) return;
        setBusy(true);
        setMessage(null);
        const result = await exportStructure(
            {
                scope,
                code,
                content,
                format,
                year,
                include_cafedras: scope === "faculty" ? includeCafedras : undefined
            },
            token
        );
        setBusy(false);
        setMessage(result.ok ? { ok: true, text: "Fayl hazırlandı və yükləndi." } : { ok: false, text: result.message });
    };

    const summary: [string, string][] = [
        ["Bölmə növü", SCOPES.find((s) => s.value === scope)?.label ?? ""],
        ["Bölmə", unitName || "Seçilməyib"],
        ...(scope === "faculty"
            ? [["Əhatə", includeCafedras ? "Dekanlıq və kafedralar" : "Yalnız dekanlıq"] as [string, string]]
            : []),
        ["Məzmun", CONTENTS.find((c) => c.value === content)?.label ?? ""],
        ["İcra ili", year ? String(year) : "Bütün illər"],
        ["Format", format === "pdf" ? "PDF sənədi" : "Excel cədvəli"],
    ];

    return (
        <div className="grid gap-6 xl:grid-cols-3">
            <div className="space-y-7 xl:col-span-2">
                <Step step={1} title="Bölmə növünü seçin">
                    <div className="grid gap-3 sm:grid-cols-3">
                        {SCOPES.map((s) => (
                            <OptionCard
                                key={s.value}
                                selected={scope === s.value}
                                onClick={() => {
                                    setScope(s.value);
                                    setMessage(null);
                                }}
                                Icon={s.Icon}
                                label={s.label}
                                hint={s.hint}
                            />
                        ))}
                    </div>
                </Step>

                <Step step={2} title="Bölməni seçin">
                    {scope === "department" ? (
                        <div>
                            <Label htmlFor="export-department">Struktur bölmə</Label>
                            <FieldSelect
                                id="export-department"
                                value={departmentCode}
                                onChange={setDepartmentCode}
                                disabled={loadingLists}
                                placeholder={loadingLists ? "Yüklənir..." : "Struktur bölməni seçin"}
                                options={departments.map((d) => ({ value: d.department_code, label: d.department_name }))}
                            />
                        </div>
                    ) : (
                        <div className={`grid gap-4 ${scope === "cafedra" ? "sm:grid-cols-2" : ""}`}>
                            <div>
                                <Label htmlFor="export-faculty">Fakültə</Label>
                                <FieldSelect
                                    id="export-faculty"
                                    value={facultyCode}
                                    onChange={setFacultyCode}
                                    disabled={loadingLists}
                                    placeholder={loadingLists ? "Yüklənir..." : "Fakültəni seçin"}
                                    options={facultyOptions}
                                />
                            </div>
                            {scope === "cafedra" && (
                                <div>
                                    <Label htmlFor="export-cafedra">Kafedra</Label>
                                    <FieldSelect
                                        id="export-cafedra"
                                        value={cafedraCode}
                                        onChange={setCafedraCode}
                                        disabled={!facultyCode || loadingCafedras}
                                        placeholder={
                                            !facultyCode
                                                ? "Əvvəlcə fakültəni seçin"
                                                : loadingCafedras
                                                    ? "Yüklənir..."
                                                    : cafedras.length === 0
                                                        ? "Bu fakültədə kafedra yoxdur"
                                                        : "Kafedranı seçin"
                                        }
                                        options={cafedras.map((c) => ({ value: c.cafedra_code, label: c.cafedra_name }))}
                                    />
                                </div>
                            )}
                            {scope === "faculty" && (
                                <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-gray-200 bg-gray-50/60 p-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-300">
                                    <input
                                        type="checkbox"
                                        checked={includeCafedras}
                                        onChange={(e) => setIncludeCafedras(e.target.checked)}
                                        className="mt-0.5 h-4 w-4 accent-brand-500"
                                    />
                                    <span>
                                        Fakültənin bütün kafedralarını da daxil et
                                        <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
                                            Hər kafedra sənəddə ayrıca başlıq altında göstərilir. Söndürüldükdə yalnız dekanlıq səviyyəsindəki əməkdaşlar ixrac olunur.
                                        </span>
                                    </span>
                                </label>
                            )}
                        </div>
                    )}
                </Step>

                <Step step={3} title="Məzmun və dövr">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                        <div className="flex-1">
                            <Label>Məzmun</Label>
                            <div role="radiogroup" className="inline-flex flex-wrap gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-900">
                                {CONTENTS.map((c) => (
                                    <button
                                        key={c.value}
                                        type="button"
                                        role="radio"
                                        aria-checked={content === c.value}
                                        onClick={() => setContent(c.value)}
                                        className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${content === c.value
                                            ? "bg-white text-gray-900 shadow-theme-xs dark:bg-gray-800 dark:text-white"
                                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                            }`}
                                    >
                                        {c.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="sm:w-48">
                            <Label htmlFor="export-year">İcra ili</Label>
                            <FieldSelect
                                id="export-year"
                                value={year ? String(year) : ""}
                                onChange={(v) => setYear(v ? Number(v) : null)}
                                placeholder="Bütün illər"
                                options={YEARS.map((y) => ({ value: String(y), label: String(y) }))}
                            />
                        </div>
                    </div>
                </Step>

                <Step step={4} title="Fayl formatı">
                    <div className="grid gap-3 sm:grid-cols-2">
                        {FORMATS.map((f) => (
                            <OptionCard
                                key={f.value}
                                selected={format === f.value}
                                onClick={() => setFormat(f.value)}
                                Icon={f.Icon}
                                label={f.label}
                                hint={f.hint}
                            />
                        ))}
                    </div>
                </Step>
            </div>

            <aside className="h-fit rounded-2xl border border-gray-200 bg-gray-50/60 p-5 xl:sticky xl:top-24 dark:border-gray-800 dark:bg-white/[0.02]">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Seçim xülasəsi</h4>
                <dl className="mt-4 space-y-3 text-sm">
                    {summary.map(([label, value]) => (
                        <div key={label} className="flex items-start justify-between gap-4">
                            <dt className="shrink-0 text-gray-500 dark:text-gray-400">{label}</dt>
                            <dd className="text-right font-medium text-gray-800 dark:text-gray-200">{value}</dd>
                        </div>
                    ))}
                </dl>
                <Button
                    type="button"
                    className="mt-5 w-full"
                    onClick={handleExport}
                    disabled={!code || busy}
                    startIcon={busy ? <CircularProgress size={16} color="inherit" /> : <FileDownloadIcon fontSize="small" />}
                >
                    {busy ? "Hazırlanır..." : "Faylı yüklə"}
                </Button>
                {!code && (
                    <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                        Davam etmək üçün bölməni seçin.
                    </p>
                )}
                {message && (
                    <p className={`mt-3 text-center text-sm ${message.ok ? "text-success-600 dark:text-success-400" : "text-error-600 dark:text-error-400"}`}>
                        {message.text}
                    </p>
                )}
            </aside>
        </div>
    );
}
