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
import Skeleton from "@mui/material/Skeleton";
import Pagination from '@mui/material/Pagination';
import { getPlans } from "../../services/plan/plan";
import VisibilityIcon from '@mui/icons-material/Visibility';
import CircularProgress from "@mui/material/CircularProgress";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { getActivityByCode } from "../../services/activity/activityService";
import { getSubmittedHesabats, SubmittedHesabatsInterface } from "../../services/hesabat/hesabatService";

export default function SubmittedHesabats() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    console.error(error);
    const [end, setEnd] = useState<number>(5);
    const [loading, setLoading] = useState(true);
    const [start, setStart] = useState<number>(0);
    const [notFound, setNotFound] = useState(false);
    const role = useSelector((state: RootState) => state.auth.role);
    const token = useSelector((state: RootState) => state.auth.token);
    const [hesabatLength, setHEsabatLength] = useState<number | null>();
    const finKod = useSelector((state: RootState) => state.auth.fin_kod);
    const [hesabats, setHesabats] = useState<SubmittedHesabatsInterface[] | undefined>([]);
    const [activityNames, setActivityNames] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        setLoading(true);
        if (finKod) {
            getSubmittedHesabats(start, end, token ? token : '')
                .then((res) => {
                    if (typeof res === "string") {
                        if (res === "NO CONTENT") {
                            setNotFound(true);
                        } else {
                            setError(res);
                        }
                    } else if (Array.isArray(res.hesabats)) {
                        setHesabats(res.hesabats);
                        setHEsabatLength(res.total_hesabats);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [start, end]);

    const getActivityNameByCode = async (activityCode: number) => {
        if (activityNames[activityCode]) {
            return activityNames[activityCode];
        }

        try {
            const res = await getActivityByCode(activityCode, token ? token : '');
            let name = "Gözlənilməz xəta";
            if (res === "Not found") {
                name = "Mismatch";
            } else if (res !== "error") {
                name = res;
            }

            setActivityNames(prev => ({ ...prev, [activityCode]: name }));
            return name;
        } catch (err) {
            return "Gözlənilməz xəta";
        }
    };

    if (loading) {
        // Skeleton table placeholder (5 rows)
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
                                    İcraçının qiymətləndirməsi
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
                                    Təhvil vermə statusu
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Qiymətləndirmə status
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
                                    Qiymətləndir
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {[...Array(5)].map((_, idx) => (
                                <TableRow key={idx}>
                                    {/* Ad, Soyad, Ata adı (Fin Kod) */}
                                    <TableCell className="px-4 py-3">
                                        <Skeleton variant="rounded" height={24} width="80%" />
                                    </TableCell>
                                    {/* Plan nömrəsi */}
                                    <TableCell className="px-4 py-3">
                                        <Skeleton variant="rounded" height={24} width="60%" />
                                    </TableCell>
                                    {/* Fəaliyyət növü */}
                                    <TableCell className="px-4 py-3">
                                        <Skeleton variant="rounded" height={24} width="70%" />
                                    </TableCell>
                                    {/* İcraçının qiymətləndirməsi */}
                                    <TableCell className="px-4 py-3">
                                        <Skeleton variant="rounded" height={24} width="50%" />
                                    </TableCell>
                                    {/* İcra tarixi */}
                                    <TableCell className="px-4 py-3">
                                        <Skeleton variant="rounded" height={24} width="40%" />
                                    </TableCell>
                                    {/* Təhvil vermə statusu */}
                                    <TableCell className="px-4 py-3">
                                        <Skeleton variant="rounded" height={24} width="60%" />
                                    </TableCell>
                                    {/* Qiymətləndirmə status */}
                                    <TableCell className="px-4 py-3">
                                        <Skeleton variant="rounded" height={24} width="60%" />
                                    </TableCell>
                                    {/* Baxış */}
                                    <TableCell className="px-4 py-3">
                                        <Skeleton variant="circular" width={40} height={40} />
                                    </TableCell>
                                    {/* Qiymətləndir */}
                                    <TableCell className="px-4 py-3">
                                        <Skeleton variant="circular" width={40} height={40} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }

    if (notFound || !hesabats || hesabats.length === 0) {
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
                                            İcraçının qiymətləndirməsi
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
                                            Təhvil vermə statusu
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Qiymətləndirmə status
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Qiymət uyğunluğu
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
                                            Qiymətləndir
                                        </TableCell>
                                    </TableRow>
                                </TableHeader>
                                {/* Table Body */}
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {hesabats?.map((hesabat, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {hesabat.name} {hesabat.surname} {hesabat.father_name} ({hesabat.fin_kod})
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {hesabat.plan_work_serial_number}
                                                </TableCell>
                                                <TableCell className="flex jusitfy-center items-center px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {hesabat.activity_type_names[0]}
                                                    <span className="text-center bg-green-200 dark:bg-green-600 text-green-900 dark:text-green-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                        +{hesabat.activity_type_names.length - 1}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {hesabat.done_percentage} ({hesabat.assessment_score})
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {hesabat.work_year}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {hesabat.duration_analysis === 1 ? (
                                                        <p className="flex justify-center items-center text-center bg-green-200 dark:bg-green-600 text-green-900 dark:text-green-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                            Vaxtında
                                                        </p>
                                                    ) : (hesabat.duration_analysis === 0) ? (
                                                        <p className="flex justify-center items-center text-center bg-red-200 dark:bg-red-600 text-red-900 dark:text-red-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                            Vaxtından gec
                                                        </p>
                                                    ) : (
                                                        <p className="flex justify-center items-center text-center bg-blue-200 dark:bg-blue-600 text-blue-900 dark:text-blue-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                            Vaxtından əvvəl
                                                        </p>
                                                    )}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {hesabat.admin_assessment || hesabat.admin_assessment === 0 ? (
                                                        <p className="text-center bg-green-200 dark:bg-green-600 text-green-900 dark:text-green-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                            Qiymətləndirilib ({hesabat.admin_assessment})
                                                        </p>
                                                    ) : (
                                                        <p className="text-center bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                            Qiymətləndirilməyib
                                                        </p>
                                                    )}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {(() => {
                                                        if (hesabat.admin_assessment === null || hesabat.admin_assessment === undefined || hesabat.assessment_score === null || hesabat.assessment_score === undefined) {
                                                            return (
                                                                <p className="text-center bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                                    Qiymətləndirilməyib
                                                                </p>
                                                            );
                                                        }

                                                        // Map assessment_score to range
                                                        const scoreRanges: { [key: number]: [number, number] } = {
                                                            1: [0, 20],
                                                            2: [30, 40],
                                                            3: [40, 60],
                                                            4: [60, 80],
                                                            5: [80, 100],
                                                        };

                                                        const range = scoreRanges[hesabat.assessment_score];
                                                        const isMatch = range && hesabat.admin_assessment >= range[0] && hesabat.admin_assessment <= range[1];

                                                        return isMatch ? (
                                                            <p className="text-center bg-green-200 dark:bg-green-600 text-green-900 dark:text-green-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                                Uyğundur
                                                            </p>
                                                        ) : (
                                                            <p className="text-center bg-red-200 dark:bg-red-600 text-red-900 dark:text-red-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                                Uyğun deyil
                                                            </p>
                                                        );
                                                    })()}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    <div onClick={() => {
                                                        navigate("/my-hesabat-details", { state: hesabat.plan_work_serial_number })
                                                    }} className="inline-flex items-center justify-center w-10 h-10 rounded-[5px] bg-yellow-200 text-yellow-400 dark:bg-yellow-400 cursor-pointer">
                                                        <VisibilityIcon className="text-yellow-500 dark:text-yellow-700" />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    <div onClick={() => {
                                                        navigate("/my-hesabat-details", { state: hesabat.plan_work_serial_number })
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
                                count={hesabatLength ? (hesabatLength <= 5 ? 1 : Math.ceil(hesabatLength / 5)) : 1}
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
                                                setHesabats(res.plans);
                                                setHEsabatLength(res.total_plans);
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
