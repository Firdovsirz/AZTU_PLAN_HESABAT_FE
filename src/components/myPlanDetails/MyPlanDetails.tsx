import Label from "../form/Label";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "../../redux/store";
import Skeleton from "@mui/material/Skeleton";
import Input from "../form/input/InputField";
import { getPlanBySerialNumber } from "../../services/plan/plan";

interface SinglePlanDetails {
    fin_kod: string;
    work_plan_serial_number: string;
    work_year: number | string;
    work_desc: string;
    goal?: string | null;
    deadline: string;
    activities: string[];
}

export default function MyPlanDetails() {
    const location = useLocation();
    const work_plan_serial_number = (location.state as string) ?? "";
    const token = useSelector((state: RootState) => state.auth.token);

    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [plan, setPlan] = useState<SinglePlanDetails | null>(null);

    useEffect(() => {
        if (!work_plan_serial_number) {
            setLoading(false);
            setNotFound(true);
            return;
        }
        setLoading(true);
        getPlanBySerialNumber(work_plan_serial_number, token ? token : "")
            .then((res) => {
                if (res === "NOT FOUND" || res === "ERROR" || typeof res === "string") {
                    setNotFound(true);
                    setPlan(null);
                } else {
                    setPlan(res as SinglePlanDetails);
                    setNotFound(false);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [work_plan_serial_number, token]);

    const formatDeadline = (deadline?: string) => {
        if (!deadline) return "Mövcud deyil";
        const date = new Date(deadline);
        if (isNaN(date.getTime())) return deadline;
        return date.toISOString().split("T")[0].replace(/-/g, "/");
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 4 }} />
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i}>
                                <Skeleton variant="rectangular" height={14} width="40%" sx={{ borderRadius: 1, mb: 1.25 }} />
                                <Skeleton variant="rectangular" height={44} sx={{ borderRadius: 2 }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (notFound || !plan) {
        return (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/60 py-16 dark:border-gray-700 dark:bg-white/[0.02]">
                <p className="mt-1 text-base font-medium text-gray-700 dark:text-gray-200">
                    Plan tapılmadı
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <section className="relative overflow-hidden rounded-3xl border border-white/30 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-6 sm:p-8 shadow-[0_30px_80px_-30px_rgba(70,95,255,0.55)]">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-20 -right-16 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -bottom-20 -left-10 h-60 w-60 rounded-full bg-blue-light-400/20 blur-3xl" />
                </div>
                <div className="relative">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur">
                        Plan #{plan.work_plan_serial_number}
                    </span>
                    <h1 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                        Plan Detalları
                    </h1>
                </div>
            </section>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div>
                        <Label>Plan nömrəsi</Label>
                        <Input type="text" value={plan.work_plan_serial_number} disabled readOnly />
                    </div>
                    <div>
                        <Label>Fin Kod</Label>
                        <Input type="text" value={plan.fin_kod} disabled readOnly />
                    </div>
                    <div>
                        <Label>İcra ili</Label>
                        <Input type="text" value={String(plan.work_year ?? "")} disabled readOnly />
                    </div>
                    <div>
                        <Label>Son tarix</Label>
                        <Input type="text" value={formatDeadline(plan.deadline)} disabled readOnly />
                    </div>
                    <div className="lg:col-span-2">
                        <Label>İşin qısa təsviri</Label>
                        <Input type="text" value={plan.work_desc ?? ""} disabled readOnly />
                    </div>
                    <div className="lg:col-span-2">
                        <Label>Hədəf</Label>
                        <Input
                            type="text"
                            value={plan.goal ?? ""}
                            placeholder={plan.goal ? undefined : "Təyin edilməyib"}
                            disabled
                            readOnly
                        />
                    </div>
                    <div className="lg:col-span-2">
                        <Label>Fəaliyyət növləri</Label>
                        <div className="flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-gray-50/60 p-3 dark:border-gray-700/70 dark:bg-white/[0.02]">
                            {Array.isArray(plan.activities) && plan.activities.length > 0 ? (
                                plan.activities.map((name, index) => (
                                    <span key={index} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-200 shadow-sm dark:bg-gray-800 dark:text-gray-300 dark:ring-white/10">
                                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-[10px] font-semibold text-white">
                                            {index + 1}
                                        </span>
                                        {name}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-400 italic text-sm">Mövcud deyil</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
