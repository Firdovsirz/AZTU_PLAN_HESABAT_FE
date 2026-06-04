import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Stack from '@mui/material/Stack';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { RootState } from "../../redux/store";
import Skeleton from "@mui/material/Skeleton";
import Pagination from '@mui/material/Pagination';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Plan, getPlanByFinKod } from "../../services/plan/plan";

interface UserPlanProps {
    finKod?: string;
}

export default function UserPlan({ finKod }: UserPlanProps) {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [plans, setPlans] = useState<Plan[] | undefined>([]);
    const [loading, setLoading] = useState(true);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(3);
    const [planLength, setPlanLength] = useState<number | null>(null);
    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
        if (finKod) {
            getPlanByFinKod(finKod, start, end, token ? token : '')
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

    // Remove old loading state here, skeletons will be rendered in table and pagination

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

    return (
        <>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                {["Fin Kod", "Plan nömrəsi", "Planın sıra sayı", "Planın qısa təsviri", "İş ili", "Baxış"].map((header) => (
                                    <TableCell
                                        key={header}
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        {loading ? (
                            <TableBody>
                                {[...Array(3)].map((_, rowIdx) => (
                                    <TableRow key={rowIdx}>
                                        {[...Array(6)].map((__, colIdx) => (
                                            <TableCell key={colIdx} className="px-4 py-3">
                                                <Skeleton variant={colIdx === 5 ? "rectangular" : "text"} width={colIdx === 5 ? 40 : 80 + colIdx*10} height={colIdx === 5 ? 40 : 24} />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
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
                                                <div
                                                    onClick={() =>
                                                        navigate("/my-plan-details", { state: plan.work_plan_serial_number })
                                                    }
                                                    className="inline-flex items-center justify-center w-10 h-10 rounded-[5px] bg-yellow-200 text-yellow-400 dark:bg-yellow-400 cursor-pointer"
                                                >
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
                {loading ? (
                    <Stack spacing={2} direction="row">
                        {[...Array(3)].map((_, idx) => (
                            <Skeleton key={idx} variant="rectangular" width={40} height={40} sx={{ borderRadius: 2 }} />
                        ))}
                    </Stack>
                ) : (
                    <Stack spacing={2}>
                        <Pagination
                            count={planLength ? (planLength <= 3 ? 1 : Math.ceil(planLength / 3)) : 1}
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
                                            setPlanLength(res.plan_count);
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
                )}
            </div>
        </>
    );
}
