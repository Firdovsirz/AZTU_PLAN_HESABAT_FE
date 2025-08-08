import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Label from "../form/Label";
import { Modal } from "../ui/modal";
import Stack from '@mui/material/Stack';
import { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import Pagination from '@mui/material/Pagination';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CircularProgress from "@mui/material/CircularProgress";
import { Plan, getPlanByFinKod } from "../../services/plan/plan";

interface UserPlanProps {
    finKod?: string;
}

export default function UserPlan({ finKod }: UserPlanProps) {
    const [error, setError] = useState("");
    const [plans, setPlans] = useState<Plan[] | undefined>([]);
    const [loading, setLoading] = useState(true);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(3);
    const [planLength, setPlanLength] = useState<number | null>(null);
    const [selectedPlan, setSelectedPlan] = useState();
    const { isOpen, openModal, closeModal } = useModal();

    useEffect(() => {
        if (finKod) {
            getPlanByFinKod(finKod, start, end)
                .then((res) => {
                    if (res === "Not found") {
                        setError("Not found");
                        setPlans(undefined);
                    } else if (res === "error") {
                        setError("Server error");
                        setPlans(undefined);
                    } else {
                        setPlans(res.plans);
                        setPlanLength(res.plan_count);
                        setError("");
                    }
                })
                .finally(() => {
                    setLoading(false);
                })
        }
    }, [finKod, start, end]);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full h-full py-10">
                <CircularProgress />
            </div>
        );
    };

    if (error === "Not found") {
        return (
            <div className="text-center text-red-500 font-medium">
                İstifadəçi üçün plan tərtib edilməyib.
            </div>
        );
    }

    if (!plans) {
        return (
            <div className="w-full flex justify-center items-center">
                <p className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                    İstifadəçi üçün plan tərtib edilməyib.
                </p>
            </div>
        );
    }

    const handleViewModal = () => {
        openModal();
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
                                    Planın sıra sayı
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Planın qısa təsviri
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    İş ili
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Baxış
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        {loading ? (
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <div className="flex justify-center items-center w-full h-full py-10">
                                            <CircularProgress />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        ) : (
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {plans?.map((plan, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {finKod}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {plan.work_plan_serial_number}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {plan.work_row_number}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {plan.work_desc?.split(" ").slice(0, 2).join(" ")}{plan.work_desc?.split(" ").length > 2 ? "..." : ""}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {plan.work_year}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <div className="inline-flex items-center justify-center w-10 h-10 rounded-[5px] bg-yellow-200 text-yellow-400 dark:bg-yellow-400 cursor-pointer" onClick={handleViewModal}>
                                                    <VisibilityIcon className="text-yellow-500 dark:text-yellow-700" />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        )}
                    </Table>
                </div>
            </div>
            <div className="w-full flex justify-center items-center">
                <Stack spacing={2}>
                    <Pagination
                        count={planLength ? (planLength <= 1 ? 1 : Math.ceil(planLength / 1)) : 1}
                        page={Math.floor(start / (end - start)) + 1}
                        onChange={(_event, page) => {
                            if (!finKod) return;
                            const pageSize = end - start;
                            const newStart = (page - 1) * pageSize;
                            const newEnd = newStart + pageSize;
                            setStart(newStart);
                            setEnd(newEnd);
                            setLoading(true);
                            getPlanByFinKod(finKod, newStart, newEnd)
                                .then((res) => {
                                    if (res === "Not found") {
                                        setError("Not found");
                                        setPlans(undefined);
                                    } else if (res === "error") {
                                        setError("Server error");
                                        setPlans(undefined);
                                    } else {
                                        setPlans(res.plans);
                                        setPlanLength(res.plan_count);
                                        setError("");
                                    }
                                })
                                .finally(() => {
                                    setLoading(false);
                                });
                        }}
                    />
                </Stack>
            </div>
            {/* <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            İş Planı
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            İş planı haqqında ətraflı məlumat
                        </p>
                    </div>
                    <form className="flex flex-col">
                        <div className="px-2 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div>
                                    <Label>Fin Kod</Label>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {plan.fin_kod}
                                    </p>
                                </div>

                                <div>
                                    <Label>Plan nömrəsi</Label>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {plan.work_plan_serial_number}
                                    </p>
                                </div>

                                <div>
                                    <Label>Plan sıra sayı</Label>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {plan.work_row_number}
                                    </p>
                                </div>

                                <div>
                                    <Label>Planın qısa təsviri</Label>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {plan.work_desc}
                                    </p>
                                </div>
                                <div>
                                    <Label>Planın icra ili</Label>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {plan.work_year}
                                    </p>
                                </div>
                                <div>
                                    <Label>Plan təhvil vermə tarixi</Label>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {plan.deadline}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal> */}
        </>
    );
}
