import {
    Table,
    TableCell,
    TableBody,
    TableHeader,
    TableRow
} from "../ui/table";
import Label from "../form/Label";
import { Modal } from "../ui/modal";
import Stack from '@mui/material/Stack';
import Button from "../ui/button/Button";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Input from "../form/input/InputField";
import { RootState } from "../../redux/store";
import Skeleton from "@mui/material/Skeleton";
import { useModal } from "../../hooks/useModal";
import EditIcon from '@mui/icons-material/Edit';
import Pagination from '@mui/material/Pagination';
import AssignmentIcon from '@mui/icons-material/Assignment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getPlanByFinKod, Plan } from "../../services/plan/plan";

export default function MyPlan() {
    const [error, setError] = useState("");
    console.error(error);
    const navigate = useNavigate();
    const [end, setEnd] = useState<number>(5);
    const [loading, setLoading] = useState(true);
    const [start, setStart] = useState<number>(0);
    const [notFound, setNotFound] = useState(false);
    const { isOpen, openModal, closeModal } = useModal();
    const [selectedPlan, setSelectedPlan] = useState<Plan>();
    const [plans, setPlans] = useState<Plan[] | undefined>([]);
    const [planLength, setPLanLength] = useState<number | null>();
    const token = useSelector((state: RootState) => state.auth.token);
    const finKod = useSelector((state: RootState) => state.auth.fin_kod);

    useEffect(() => {
        if (finKod) {
            getPlanByFinKod(finKod, start, end, token ? token : '')
                .then(
                    (res) => {
                        if (res === "Not found") {
                            setNotFound(true);
                        } else if (res === "error") {
                            setError(res);
                        } else {
                            setPlans(res.plans);
                            setPLanLength(res.plan_count);
                        }
                    }
                )
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [finKod]);

    const TableShell = ({ children }: { children: React.ReactNode }) => (
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white/90 backdrop-blur-sm shadow-sm shadow-gray-900/[0.02] dark:border-gray-800 dark:bg-gray-900/40">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />
            <div className="max-w-full overflow-x-auto">{children}</div>
        </div>
    );

    const headers = [
        "Fin Kod",
        "Plan №",
        "Fəaliyyət növü",
        "Sıra",
        "İcra tarixi",
        "Baxış",
        "Redaktə",
    ];

    if (loading) {
        const skeletonRows = Array.from({ length: 5 });
        return (
            <TableShell>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {headers.map((h) => (
                                <TableCell key={h} isHeader>{h}</TableCell>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {skeletonRows.map((_, idx) => (
                            <TableRow key={idx}>
                                {headers.map((_, i) => (
                                    <TableCell key={i}>
                                        <Skeleton variant="rectangular" height={20} sx={{ borderRadius: 1.5 }} />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableShell>
        );
    }

    if (notFound || !plans || plans.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/60 py-16 dark:border-gray-700 dark:bg-white/[0.02]">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/10 to-brand-500/5 text-brand-500 ring-1 ring-inset ring-brand-500/20">
                    <AssignmentIcon />
                </div>
                <p className="mt-4 text-base font-medium text-gray-700 dark:text-gray-200">
                    Plan tapılmadı
                </p>
                <p className="mt-1 text-sm text-gray-500">
                    Hələ heç bir plan əlavə etməmisiniz.
                </p>
            </div>
        );
    }

    return (
        <>
            <TableShell>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {headers.map((h) => (
                                <TableCell key={h} isHeader>{h}</TableCell>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {plans?.map((plan, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-700 ring-1 ring-inset ring-gray-200 dark:bg-white/5 dark:text-gray-300 dark:ring-white/10">
                                            {plan.fin_kod}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            #{plan.work_plan_serial_number}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {plan.activity_type_names && plan.activity_type_names.length > 0 ? (
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-medium text-brand-700 ring-1 ring-inset ring-brand-200/60 dark:bg-brand-500/10 dark:text-brand-300 dark:ring-brand-500/20">
                                                    {plan.activity_type_names[0]}
                                                </span>
                                                {plan.activity_type_names.length > 1 && (
                                                    <span className="inline-flex items-center rounded-full bg-success-50 px-2 py-0.5 text-[11px] font-semibold text-success-700 ring-1 ring-inset ring-success-200/60 dark:bg-success-500/10 dark:text-success-400 dark:ring-success-500/20">
                                                        +{plan.activity_type_names.length - 1}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic">Mövcud deyil</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-gray-600 dark:text-gray-300">
                                            {plan.work_row_number}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                                            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                                            {plan.work_year}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedPlan(plan);
                                                openModal();
                                            }}
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-warning-50 text-warning-600 ring-1 ring-inset ring-warning-200/70 transition-all hover:bg-warning-100 hover:scale-105 active:scale-95 dark:bg-warning-500/10 dark:text-warning-400 dark:ring-warning-500/20"
                                            title="Baxış"
                                        >
                                            <VisibilityIcon sx={{ fontSize: 18 }} />
                                        </button>
                                    </TableCell>
                                    <TableCell>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigate("/edit-plan", { state: { work_plan_serial_number: plan.work_plan_serial_number } });
                                            }}
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-200/70 transition-all hover:bg-brand-100 hover:scale-105 active:scale-95 dark:bg-brand-500/10 dark:text-brand-400 dark:ring-brand-500/20"
                                            title="Redaktə et"
                                        >
                                            <EditIcon sx={{ fontSize: 18 }} />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableShell>

            <div className="mt-6 flex justify-center items-center">
                <Stack spacing={2}>
                    <Pagination
                        count={planLength ? (planLength <= 5 ? 1 : Math.ceil(planLength / 5)) : 1}
                        page={Math.floor(start / (end - start)) + 1}
                        shape="rounded"
                        onChange={(_event, page) => {
                            if (!finKod) return;
                            const pageSize = end - start;
                            const newStart = (page - 1) * pageSize;
                            const newEnd = newStart + pageSize;
                            setStart(newStart);
                            setEnd(newEnd);
                            setLoading(true);
                            getPlanByFinKod(finKod, newStart, newEnd, token ? token : '')
                                .then((res) => {
                                    if (res === "Not found") {
                                        setError("Not found");
                                        setPlans(undefined);
                                    } else if (res === "error") {
                                        setError("Server error");
                                        setPlans(undefined);
                                    } else {
                                        setPlans(res.plans);
                                        setPLanLength(res.plan_count);
                                        setError("");
                                    }
                                })
                                .finally(() => {
                                    setLoading(false);
                                });
                        }}
                        sx={{
                            '& .MuiPaginationItem-root': {
                                color: '#475467',
                                bgcolor: '#fff',
                                border: '1px solid #e4e7ec',
                                fontWeight: 500,
                            },
                            '& .MuiPaginationItem-root.Mui-selected': {
                                background: 'linear-gradient(to bottom, #465fff, #3641f5)',
                                color: '#fff',
                                border: 'none',
                                boxShadow: '0 4px 10px -2px rgba(70,95,255,0.4)',
                                '&:hover': {
                                    background: 'linear-gradient(to bottom, #3641f5, #2a31d8)',
                                },
                            },
                            '& .MuiPaginationItem-root:hover': {
                                bgcolor: '#f9fafb',
                            },
                        }}
                    />
                </Stack>
            </div>

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[720px] m-4">
                <div className="relative w-full overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900">
                    <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 px-8 py-7">
                        <div className="pointer-events-none absolute -top-12 -right-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur">
                            Plan #{selectedPlan?.work_plan_serial_number}
                        </span>
                        <h4 className="relative mt-3 text-2xl font-semibold text-white">
                            Plan Detalları
                        </h4>
                    </div>
                    <form className="flex flex-col p-6 lg:p-8">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                            <div>
                                <Label>Plan nömrəsi</Label>
                                <Input type="text" value={selectedPlan?.work_plan_serial_number} readOnly />
                            </div>
                            <div>
                                <Label>Fin Kod</Label>
                                <Input type="text" value={selectedPlan?.fin_kod} readOnly />
                            </div>
                            <div>
                                <Label>İşin sıra sayı</Label>
                                <Input type="text" value={selectedPlan?.work_row_number} readOnly />
                            </div>
                            <div>
                                <Label>İcra ili</Label>
                                <Input type="text" value={selectedPlan?.work_year} />
                            </div>
                            <div>
                                <Label>Son tarix</Label>
                                <Input type="text" value={(() => {
                                    if (!selectedPlan?.deadline) return "Mövcud deyil";
                                    const createdDate = new Date(selectedPlan?.deadline);
                                    const today = new Date();
                                    const yesterday = new Date();
                                    yesterday.setDate(today.getDate() - 1);
                                    const isToday = createdDate.toDateString() === today.toDateString();
                                    const isYesterday = createdDate.toDateString() === yesterday.toDateString();
                                    if (isToday) return "Bugün";
                                    if (isYesterday) return "Dünən";
                                    return createdDate.toISOString().split("T")[0].replace(/-/g, "/");
                                })()} />
                            </div>
                            <div>
                                <Label>İşin qısa təsviri</Label>
                                <Input type="text" value={selectedPlan?.work_desc} />
                            </div>
                            <div className="lg:col-span-2">
                                <Label>Fəaliyyət növləri</Label>
                                <div className="flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-gray-50/60 p-3 dark:border-gray-700/70 dark:bg-white/[0.02]">
                                    {selectedPlan?.activity_type_names.map((name, index) => (
                                        <span key={index} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-200 shadow-sm dark:bg-gray-800 dark:text-gray-300 dark:ring-white/10">
                                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-[10px] font-semibold text-white">
                                                {index + 1}
                                            </span>
                                            {name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-7 flex items-center justify-end gap-3 border-t border-gray-100 pt-5 dark:border-gray-800">
                            <Button size="sm" variant="outline" onClick={closeModal}>
                                Bağla
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    )
}
