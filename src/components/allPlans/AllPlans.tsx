import {
    Table,
    TableCell,
    TableBody,
    TableHeader,
    TableRow
} from "../ui/table";
import { Link } from "react-router";
import Stack from '@mui/material/Stack';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { RootState } from "../../redux/store";
import Skeleton from '@mui/material/Skeleton';
import Pagination from '@mui/material/Pagination';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AllPlan, getPlans } from "../../services/plan/plan";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function AllPlans() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    console.error(error);
    const [end, setEnd] = useState<number>(5);
    const [loading, setLoading] = useState(true);
    const [start, setStart] = useState<number>(0);
    const [notFound, setNotFound] = useState(false);
    const [planLength, setPLanLength] = useState<number | null>();
    const [plans, setPlans] = useState<AllPlan[] | undefined>([]);
    const role = useSelector((state: RootState) => state.auth.role);
    const token = useSelector((state: RootState) => state.auth.token);
    const finKod = useSelector((state: RootState) => state.auth.fin_kod);

    useEffect(() => {
        setLoading(true);
        if (finKod) {
            getPlans(start, end, token ? token : '')
                .then((res) => {
                    if (typeof res === "string") {
                        if (res === "NO CONTENT") {
                            setNotFound(true);
                        } else {
                            setError(res);
                        }
                    } else if (Array.isArray(res.plans)) {
                        setPlans(res.plans);
                        console.log(res.plans);
                        setPLanLength(res.total_plans);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [start, end]);

    console.log(plans);

    if (loading) {
        return (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Ad, Soyad, Ata adı (Fin Kod)</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Plan nömrəsi</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Fəaliyyət növü</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">İşin sıra sayı</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">İcra tarixi</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Baxış</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Qiymətləndir</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {[...Array(5)].map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Skeleton variant="rounded" width="80%" height={24} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Skeleton variant="rounded" width="60%" height={24} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Skeleton variant="rounded" width="70%" height={24} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Skeleton variant="rounded" width="50%" height={24} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Skeleton variant="rounded" width="40%" height={24} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Skeleton variant="rounded" width="60%" height={24} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Skeleton variant="circular" width={28} height={28} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Skeleton variant="circular" width={28} height={28} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }

    if (notFound || !plans || plans.length === 0) {
        return (
            <div className="w-full flex justify-center items-center">
                Plan mövcud deyil
            </div>
        );
    }

    return (
        <>
            {role === 1 ? (
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
                                            Ad, Soyad, Ata adı (Fin Kod)
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
                                            Status
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
                                            Hesabat
                                        </TableCell>
                                    </TableRow>
                                </TableHeader>
                                {/* Table Body */}
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {plans?.map((plan, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {plan.name} {plan.surname} {plan.father_name} ({plan.fin_kod})
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {plan.work_plan_serial_number}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {plan.activity_type_names[0]} <span className="text-center bg-green-200 dark:bg-green-600 text-green-900 dark:text-green-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">+{plan.activity_type_names.length - 1}</span>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {plan.work_row_number}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {plan.work_year}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {plan.is_submitted ? (
                                                        <p className="text-center bg-green-200 dark:bg-green-600 text-green-900 dark:text-green-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                            Təhvil verilib
                                                        </p>
                                                    ) : (
                                                        <p className="text-center bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                            İcradadır
                                                        </p>
                                                    )}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    <div onClick={() => {
                                                        navigate("/my-plan-details", { state: plan.work_plan_serial_number })
                                                    }} className="inline-flex items-center justify-center w-10 h-10 rounded-[5px] bg-yellow-200 text-yellow-400 dark:bg-yellow-400 cursor-pointer">
                                                        <VisibilityIcon className="text-yellow-500 dark:text-yellow-700" />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    <div onClick={() => {
                                                        navigate("/my-hesabat-details", { state: plan.work_plan_serial_number })
                                                    }} className="inline-flex items-center justify-center w-10 h-10 rounded-[5px] bg-blue-600 dark:bg-blue-600 cursor-pointer">
                                                        <ArrowOutwardIcon className="text-white dark:text-white" />
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
                                    getPlans(newStart, newEnd, token ? token : '')
                                        .then((res) => {
                                            if (typeof res === "string") {
                                                if (res === "NO CONTENT") {
                                                    setNotFound(true);
                                                } else {
                                                    setError(res);
                                                }
                                            } else if (Array.isArray(res.plans)) {
                                                setPlans(res.plans);
                                                setPLanLength(res.total_plans);
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
                </>
            ) : (
                <div className="flex flex-col items-center justify-center p-6 mt-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-center">
                    <ErrorOutlineIcon className="text-red-500 dark:text-red-400 mb-2" style={{ fontSize: 40 }} />
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                        Bu səhifəyə baxmaq üçün icazəniz yoxdur
                    </p>
                    <Link
                        to="/home"
                        className="mt-[20px] inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                        Əsas səhifəyə qayıt
                    </Link>
                </div>
            )}
        </>
    )
}
