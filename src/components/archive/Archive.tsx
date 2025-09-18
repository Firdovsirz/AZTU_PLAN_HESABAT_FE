import {
    Table,
    TableCell,
    TableBody,
    TableHeader,
    TableRow
} from "../ui/table";
import Stack from '@mui/material/Stack';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { RootState } from "../../redux/store";
import Skeleton from "@mui/material/Skeleton";
import Pagination from '@mui/material/Pagination';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getArchive, ArchiveInterface } from "../../services/hesabat/hesabatService";

export default function Archive() {
    const navigate = useNavigate();
    const [end, setEnd] = useState(5);
    const [error, setError] = useState("");
    console.log(error);
    const [loading, setLoading] = useState(true);
    const [start, setStart] = useState<number>(0);
    const [notFound, setNotFound] = useState(false);
    const token = useSelector((state: RootState) => state.auth.token);
    const finKod = useSelector((state: RootState) => state.auth.fin_kod);
    const [hesabatLength, setHesabatLength] = useState<number | null>(null);
    const [hesabats, setHesabats] = useState<ArchiveInterface[] | undefined>([]);

    useEffect(() => {
        if (finKod) {
            getArchive(start, end, token ? token : '')
                .then(
                    (res) => {
                        if (res === "NO CONTENT") {
                            setNotFound(true);
                        } else if (res === "ERROR") {
                            setError(res);
                        } else {
                            setHesabats(res.archive);
                            setHesabatLength(res.hesabat_count);
                        }
                    }
                )
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [finKod]);

    if (loading) {
        return (
            <>
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
                                        İcraçı qiyməti
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Yekun qiymət
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Süni intellekt qiyməti
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
                                {[...Array(5)].map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="px-4 py-3 text-theme-sm">
                                            <Skeleton variant="rectangular" width="100%" height={24} className="rounded-md" />
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-theme-sm">
                                            <Skeleton variant="rectangular" width="100%" height={24} className="rounded-md" />
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-theme-sm">
                                            <Skeleton variant="rectangular" width="100%" height={24} className="rounded-md" />
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-theme-sm">
                                            <Skeleton variant="rectangular" width="100%" height={24} className="rounded-md" />
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-theme-sm">
                                            <Skeleton variant="rectangular" width="100%" height={24} className="rounded-md" />
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-theme-sm">
                                            <Skeleton variant="rectangular" width={40} height={40} className="rounded-md" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                {/* Skeleton loader for pagination */}
                <div className="w-full flex justify-center items-center mt-4">
                    <Skeleton variant="rectangular" width={250} height={40} />
                </div>
            </>
        );
    }

    if (notFound || !hesabats || hesabats.length === 0) {
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
                                    İcraçı qiyməti
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Admin qiyməti
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Süni intellekt qiyməti
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
                                            {hesabat.work_plan_serial_number}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {hesabat.activity_type_names[0]}
                                            <span className="text-center bg-green-200 dark:bg-green-600 text-green-900 dark:text-green-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                +{hesabat.activity_type_names.length - 1}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {hesabat.assessment_score === 1 || hesabat.assessment_score === 2 ? (
                                                <p className="bg-red-200 dark:bg-red-600 text-red-900 dark:text-red-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                    {hesabat.done_percentage} ({hesabat.assessment_score})
                                                </p>
                                            ) : hesabat.assessment_score === 3 || hesabat.assessment_score === 4 ? (
                                                <p className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                    {hesabat.done_percentage} ({hesabat.assessment_score})
                                                </p>
                                            ) : hesabat.assessment_score === 5 ? (
                                                <p className="bg-green-200 dark:bg-green-600 text-green-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                    {hesabat.done_percentage} ({hesabat.assessment_score})
                                                </p>
                                            ) : null}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {hesabat.admin_assessment > 0 && hesabat.admin_assessment <= 40 ? (
                                                <p className="bg-red-200 dark:bg-red-600 text-red-900 dark:text-red-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                    {hesabat.admin_assessment}%
                                                    ({
                                                        hesabat.admin_assessment > 0 && hesabat.admin_assessment <= 20 ?
                                                            1 :
                                                            hesabat.admin_assessment > 20 && hesabat.admin_assessment <= 40 ?
                                                                2 : null
                                                    })
                                                </p>
                                            ) : hesabat.admin_assessment > 40 && hesabat.admin_assessment <= 80 ? (
                                                <p className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                    {hesabat.admin_assessment}%
                                                    ({
                                                        hesabat.admin_assessment > 40 && hesabat.admin_assessment <= 60 ?
                                                            3 :
                                                            hesabat.admin_assessment > 60 && hesabat.admin_assessment <= 80 ?
                                                                4 : null
                                                    })
                                                </p>
                                            ) : hesabat.admin_assessment > 80 ? (
                                                <p className="bg-green-200 dark:bg-green-600 text-green-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                    {hesabat.admin_assessment}%
                                                    ({
                                                        hesabat.admin_assessment > 80 ?
                                                            5 : null
                                                    })
                                                </p>
                                            ) : null}
                                        </TableCell>
                                        {hesabat.ai_assessment ? (
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {hesabat.ai_assessment > 0 && hesabat.ai_assessment <= 40 ? (
                                                    <p className="bg-red-200 dark:bg-red-600 text-red-900 dark:text-red-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                        {hesabat.ai_assessment}%
                                                        ({
                                                            hesabat.ai_assessment > 0 && hesabat.ai_assessment <= 20 ?
                                                                1 :
                                                                hesabat.ai_assessment > 20 && hesabat.ai_assessment <= 40 ?
                                                                    2 : null
                                                        })
                                                    </p>
                                                ) : hesabat.ai_assessment > 40 && hesabat.ai_assessment <= 80 ? (
                                                    <p className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                        {hesabat.ai_assessment}%
                                                        ({
                                                            hesabat.ai_assessment > 40 && hesabat.ai_assessment <= 60 ?
                                                                3 :
                                                                hesabat.ai_assessment > 60 && hesabat.ai_assessment <= 80 ?
                                                                    4 : null
                                                        })
                                                    </p>
                                                ) : hesabat.ai_assessment > 80 ? (
                                                    <p className="bg-green-200 dark:bg-green-600 text-green-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                        {hesabat.ai_assessment}%
                                                        ({
                                                            hesabat.ai_assessment > 80 ?
                                                                5 : null
                                                        })
                                                    </p>
                                                ) : null}
                                            </TableCell>
                                        ) : (
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <p className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                    Mövcud deyil
                                                </p>
                                            </TableCell>
                                        )}
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
                                                navigate("/my-hesabat-details", { state: hesabat.work_plan_serial_number })
                                            }} className="inline-flex items-center justify-center w-10 h-10 rounded-[5px] bg-yellow-200 text-yellow-400 dark:bg-yellow-400 cursor-pointer">
                                                <VisibilityIcon className="text-yellow-500 dark:text-yellow-700" />
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
                            getArchive(newStart, newEnd, token ? token : '')
                                .then((res) => {
                                    if (res === "NO CONTENT") {
                                        setError("Not found");
                                        setHesabats(undefined);
                                    } else if (res === "ERROR") {
                                        setError("Server error");
                                        setHesabats(undefined);
                                    } else {
                                        setHesabats(res.archive);
                                        setHesabatLength(res.hesabat_count);
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
        </>
    )
}
