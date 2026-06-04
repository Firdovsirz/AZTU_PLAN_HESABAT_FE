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
import Skeleton from '@mui/material/Skeleton';
import Pagination from '@mui/material/Pagination';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Hesabat, getHesabatByFinKod } from "../../services/hesabat/hesabatService";

interface UserPlanProps {
    finKod?: string;
}

export default function UserHesabat({ finKod }: UserPlanProps) {
    const navigate = useNavigate();
    const [end, setEnd] = useState(3);
    const [error, setError] = useState("");
    const [start, setStart] = useState(0);
    const [loading, setLoading] = useState(true);
    const [hesabatLength, setHesabatLength] = useState();
    const [hesabats, setHesabats] = useState<Hesabat[] | undefined>([]);
    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
        if (finKod) {
            getHesabatByFinKod(finKod, start, end, token ? token : '')
                .then((res) => {
                    if (res === "Not found") {
                        setError("Not found");
                        setHesabats(undefined);
                    } else if (res === "error") {
                        setError("Server error");
                        setHesabats(undefined);
                    } else {
                        setHesabats(res.hesabats);
                        setHesabatLength(res.hesabat_count);
                        setError("");
                    }
                })
                .finally(() => {
                    setLoading(false);
                })
        }
    }, [finKod]);

    if (loading) {
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
                                    Təhvil statusu
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Qiymətləndirmə
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
                            {[...Array(3)].map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Skeleton variant="text" width={80} height={20} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Skeleton variant="text" width={100} height={20} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Skeleton variant="text" width={120} height={20} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: '20px' }} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Skeleton variant="text" width={40} height={20} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Skeleton variant="circular" width={40} height={40} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    };

    if (error === "Not found") {
        return (
            <div className="text-center text-red-500 font-medium">
                İstifadəçi üçün hesabat tərtib edilməyib.
            </div>
        );
    }

    if (!hesabats) {
        return (
            <div className="w-full flex justify-center items-center">
                <p className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                    İstifadəçi üçün hesabat tərtib edilməyib.
                </p>
            </div>
        );
    };
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
                                    Təhvil statusu
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Qiymətləndirmə
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
                                            {hesabat?.fin_kod}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {hesabat.work_plan_serial_number}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {hesabat.activity_type_codes?.join(", ")}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {!hesabat.submitted ? (
                                                <p className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                    Təhvil verilməyib
                                                </p>
                                            ) : (
                                                <p className="bg-green-200 dark:bg-green-600 text-green-900 dark:text-green-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                    Təhvil verilib
                                                </p>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {!hesabat.assessment_score ? (
                                                <p className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                    Təyin edilməyib
                                                </p>
                                            ) : (
                                                <>
                                                    {hesabat.assessment_score}
                                                </>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div
                                                onClick={() =>
                                                    navigate("/my-hesabat-details", { state: hesabat.work_plan_serial_number })
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
                    </Table>
                </div>
            </div>
            <div className="w-full flex justify-center items-center">
                <Stack spacing={2}>
                    <Pagination
                        count={hesabatLength ? (hesabatLength <= 3 ? 1 : Math.ceil(hesabatLength / 3)) : 1}
                        page={Math.floor(start / (end - start)) + 1}
                        onChange={(_event, page) => {
                            if (!finKod) return;
                            const pageSize = end - start;
                            const newStart = (page - 1) * pageSize;
                            const newEnd = newStart + pageSize;
                            setStart(newStart);
                            setEnd(newEnd);
                            setLoading(true);
                            getHesabatByFinKod(finKod, start, end, token ? token : '')
                                .then((res) => {
                                    if (res === "Not found") {
                                        setError("Not found");
                                        setHesabats(undefined);
                                    } else if (res === "error") {
                                        setError("Server error");
                                        setHesabats(undefined);
                                    } else {
                                        setHesabats(res.hesabats);
                                        setError("");
                                    }
                                })
                                .finally(() => {
                                    setLoading(false);
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
    );
}
