import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Link } from "react-router";
import Stack from '@mui/material/Stack';
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import { RootState } from "../../redux/store";
import Pagination from '@mui/material/Pagination';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { getExecutionUsers, User } from "../../services/user/user";

export default function ReportUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(10);
    const role = useSelector((state: RootState) => state.auth.role);
    const [userLength, setUserLength] = useState<number | null>(null);
    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
        getExecutionUsers(start, end, token ? token : '')
            .then((res) => {
                if (res === "No user found.") {
                    setNotFound(true);
                } else {
                    setUsers(res.users);
                    setUserLength(res.user_count);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (notFound) {
        return (
            <div className="w-full flex justify-center items-center">
                <p className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                    İstifadəçi tapılmadı.
                </p>
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
                                            Ad, Soyad, Ata adı
                                        </TableCell>
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
                                            Vəzifə
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Fakültə
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Qeydiyyat tarixi
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
                                        {[...Array(5)].map((_, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell className="px-4 py-3">
                                                    <Skeleton variant="rounded" height={24} />
                                                </TableCell>
                                                <TableCell className="px-4 py-3">
                                                    <Skeleton variant="rounded" height={24} width={80} />
                                                </TableCell>
                                                <TableCell className="px-4 py-3">
                                                    <Skeleton variant="rounded" height={24} width={60} />
                                                </TableCell>
                                                <TableCell className="px-4 py-3">
                                                    <Skeleton variant="rounded" height={24} width={60} />
                                                </TableCell>
                                                <TableCell className="px-4 py-3">
                                                    <Skeleton variant="rounded" height={24} width={70} />
                                                </TableCell>
                                                <TableCell className="px-4 py-3">
                                                    <Skeleton variant="circular" width={40} height={40} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                ) : (
                                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                        {Array.isArray(users) && users?.map((user, index) => {
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                        {user?.name} {user?.surname} {user?.father_name}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                        {user?.fin_kod}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                        {user?.duty_name ? (
                                                            <>
                                                                {user?.duty_name}
                                                            </>
                                                        ) : (
                                                            <p className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                                Mövcud deyil
                                                            </p>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                        {user?.faculty_code ? (
                                                            <>
                                                                {user?.faculty_code}
                                                            </>
                                                        ) : (
                                                            <p className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                                Mövcud deyil
                                                            </p>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                        {(() => {
                                                            if (!user?.created_at) return "Mövcud deyil";
                                                            const createdDate = new Date(user.created_at);
                                                            const today = new Date();
                                                            const yesterday = new Date();
                                                            yesterday.setDate(today.getDate() - 1);

                                                            const isToday = createdDate.toDateString() === today.toDateString();
                                                            const isYesterday = createdDate.toDateString() === yesterday.toDateString();

                                                            if (isToday) return "Bugün";
                                                            if (isYesterday) return "Dünən";
                                                            return createdDate.toISOString().split("T")[0].replace(/-/g, "/");
                                                        })()}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                        <Link to={`/user/${user?.fin_kod}`}>
                                                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-[5px] bg-yellow-200 text-yellow-400 dark:bg-yellow-400 cursor-pointer">
                                                                <VisibilityIcon className="text-yellow-500 dark:text-yellow-700" />
                                                            </div>
                                                        </Link>
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
                                count={userLength ? (userLength <= 10 ? 1 : Math.ceil(userLength / 10)) : 1}
                                page={Math.floor(start / (end - start)) + 1}
                                onChange={(_event, page) => {
                                    const pageSize = end - start;
                                    const newStart = (page - 1) * pageSize;
                                    const newEnd = newStart + pageSize;
                                    setStart(newStart);
                                    setEnd(newEnd);
                                    setLoading(true);
                                    setNotFound(false);
                                    getExecutionUsers(newStart, newEnd, token ? token : '')
                                        .then((res) => {
                                            if (res === "No user found.") {
                                                setNotFound(true);
                                                setUsers([]);
                                            } else if ('users' in res) {
                                                setUsers(res.users);
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
    );
}
