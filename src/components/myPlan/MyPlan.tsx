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

    if (loading) {
        const skeletonRows = Array.from({ length: 5 });
        return (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Fin Kod
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Plan nömrəsi
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Fəaliyyət növü
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    İşin sıra sayı
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    İcra tarixi
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Baxış
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {skeletonRows.map((_, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="px-4 py-3">
                                        <Skeleton variant="rectangular" height={24} width={80} style={{ borderRadius: 8 }} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <Skeleton variant="rectangular" height={24} width={100} style={{ borderRadius: 8 }} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <Skeleton variant="rectangular" height={24} width={120} style={{ borderRadius: 8 }} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <Skeleton variant="rectangular" height={24} width={60} style={{ borderRadius: 8 }} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <Skeleton variant="rectangular" height={24} width={80} style={{ borderRadius: 8 }} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <Skeleton variant="circular" width={32} height={32} style={{ borderRadius: 16 }} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    };

    if (notFound || !plans || plans.length === 0) {
        return (
            <div className="w-full flex justify-center items-center">
                <p className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                    Mövcud deyil
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Fin Kod
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Plan nömrəsi
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Fəaliyyət növü
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    İşin sıra sayı
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    İcra tarixi
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Baxış
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Redaktə et
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {plans?.map((plan, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {plan.fin_kod}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {plan.work_plan_serial_number}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {plan.activity_type_names && plan.activity_type_names.length > 0 ? (
                                                <>
                                                    {plan.activity_type_names[0]}
                                                    {plan.activity_type_names.length > 1 && (
                                                        <span className="text-center bg-green-200 dark:bg-green-600 text-green-900 dark:text-green-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                            +{plan.activity_type_names.length - 1}
                                                        </span>
                                                    )}
                                                </>
                                            ) : (
                                                "Mövcud deyil"
                                            )}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {plan.work_row_number}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {plan.work_year}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div onClick={() => {
                                                setSelectedPlan(plan);
                                                openModal();
                                            }} className="inline-flex items-center justify-center w-10 h-10 rounded-[5px] bg-yellow-200 text-yellow-400 dark:bg-yellow-400 cursor-pointer">
                                                <VisibilityIcon className="text-yellow-500 dark:text-yellow-700" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div onClick={() => {
                                                navigate("/edit-plan", { state: { work_plan_serial_number: plan.work_plan_serial_number } });
                                            }} className="inline-flex items-center justify-center w-10 h-10 rounded-[5px] bg-blue-200 text-blue-400 dark:bg-blue-400 cursor-pointer">
                                                <EditIcon className="text-blue-500 dark:text-blue-700" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className="w-full flex justify-center items-center">
                <Stack spacing={2}>
                    <Pagination
                        count={planLength ? (planLength <= 5 ? 1 : Math.ceil(planLength / 5)) : 1}
                        page={Math.floor(start / (end - start)) + 1}
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
                                color: 'text.primary',
                                bgcolor: 'background.paper',
                            },
                            '& .MuiPaginationItem-root.Mui-selected': {
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                },
                            },
                            '& .MuiPaginationItem-root:hover': {
                                bgcolor: 'action.hover',
                            },
                        }}
                    />
                </Stack>
            </div>
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Plan Detalları
                        </h4>
                    </div>
                    <form className="flex flex-col">
                        <div className="px-2 overflow-y-auto custom-scrollbar">
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

                                <div>
                                    <Label>Fəaliyyət növləri</Label>
                                    <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300">
                                        {selectedPlan?.activity_type_names.map((name, index) => (
                                            <li key={index}>{name}</li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
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
