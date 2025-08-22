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
import { RootState } from "../../redux/store";
import Skeleton from "@mui/material/Skeleton";
import Pagination from '@mui/material/Pagination';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getUsers, AllUser } from "../../services/user/user";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

type AllUsersFilterProps = {
    filters: {
        name?: string;
        surname?: string;
        fatherName?: string;
        finKod?: string;
        faculty?: string;
        cafedra?: string;
    };
};

export default function AllUsers({ filters }: AllUsersFilterProps) {
    const [error, setError] = useState("");
    console.error(error);
    const [end, setEnd] = useState<number>(10);
    const [loading, setLoading] = useState(true);
    const [start, setStart] = useState<number>(0);
    const [users, setUsers] = useState<AllUser[]>([]);
    const [noContent, setNoContent] = useState(false);
    const [userLength, setUserLength] = useState<number>(0);
    const token = useSelector((state: RootState) => state.auth.token);
    const role = useSelector((state: RootState) => state.auth.role);

    useEffect(() => {
        setLoading(true);

        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== undefined && v !== "")
        );

        getUsers({
            start,
            end,
            ...cleanFilters,
        }, token ? token : "")
            .then((res) => {
                if (res === "ERROR") {
                    setError("Not found");
                    setUsers([]);
                    setNoContent(false);
                } else if (res === "NO CONTENT") {
                    setNoContent(true);
                    setError("No user");
                    setUsers([]);
                } else if (Array.isArray(res.users)) {
                    console.log("Final filters:", cleanFilters);
                    setUsers(res.users);
                    setUserLength(res.total_users);
                    setError("");
                    setNoContent(false);
                }
            })
            .finally(() => setLoading(false));
    }, [filters, start, end]);

    console.log(noContent);

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
                                    İcraçı statusu
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
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {[...Array(5)].map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell className="px-4 py-3 text-start">
                                        <Skeleton variant="text" width="80%" height={24} sx={{ borderRadius: 1 }} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-start">
                                        <Skeleton variant="text" width="60%" height={24} sx={{ borderRadius: 1 }} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-start">
                                        <Skeleton variant="text" width="70%" height={24} sx={{ borderRadius: 1 }} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-start">
                                        <Skeleton variant="text" width="50%" height={24} sx={{ borderRadius: 1 }} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-start">
                                        <Skeleton variant="text" width="65%" height={24} sx={{ borderRadius: 1 }} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-start">
                                        <Skeleton variant="text" width="40%" height={24} sx={{ borderRadius: 1 }} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-start flex justify-center">
                                        <Skeleton variant="circular" width={32} height={32} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    };

    return (
        <>
            {role === 1 ? (
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
                                        İcraçı statusu
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
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {noContent ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-6 text-gray-500 dark:text-gray-400">
                                            İstifadəçi yoxdur
                                        </TableCell>
                                    </TableRow>
                                ) : null}
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
                                                {user.is_execution ? (
                                                    <p className="bg-green-200 dark:bg-green-600 text-green-900 dark:text-green-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                        İcraçı şəxsdir
                                                    </p>
                                                ) : (
                                                    <p className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                        İcraçı şəxs deyil
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
                        </Table>
                    </div>
                </div>
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
            {users.length !== 0 && role === 1 ? (
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
                                getUsers({
                                    start: newStart,
                                    end: newEnd,
                                    ...filters,
                                })
                                    .then((res) => {
                                        if (res === "ERROR") {
                                            setError("Not found");
                                            setUsers([]);
                                        } else if (res === "NO CONTENT") {
                                            setError("No user");
                                            setUsers([]);
                                        } else {
                                            setUsers(res.users);
                                            setUserLength(res.total_users);
                                            setError("");
                                        }
                                    })
                                    .finally(() => setLoading(false));
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
            ) : null}
        </>
    );
}
