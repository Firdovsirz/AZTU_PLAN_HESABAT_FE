import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import {
    getApproveWaitingUsers,
    AppWaitingUser,
    ResponseStatus,
    approveUser,
    rejectUser
} from "../../services/user/user";
import Swal from "sweetalert2";
import { Link } from "react-router";
import Stack from '@mui/material/Stack';
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "../../redux/store";
import Skeleton from "@mui/material/Skeleton";
import DoneIcon from '@mui/icons-material/Done';
import Pagination from '@mui/material/Pagination';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function ApproveWaitingUsers() {
    const [error, setError] = useState("");
    const [end, setEnd] = useState<number>(10);
    const [loading, setLoading] = useState(true);
    const [start, setStart] = useState<number>(0);
    const [noContent, setNoContent] = useState(false);
    const [userLength, setUserLength] = useState<number>(0);
    const [users, setUsers] = useState<AppWaitingUser[]>([]);
    const role = useSelector((state: RootState) => state.auth.role);
    const token = useSelector((state: RootState) => state.auth.token);

    console.log(error);

    useEffect(() => {
        setLoading(true);
        getApproveWaitingUsers(token ?? '', start, end)
            .then((res) => {
                if (res === ResponseStatus.NO_CONTENT) {
                    setNoContent(true);
                    setUsers([]);
                    setUserLength(0);
                } else if (res === ResponseStatus.ERROR || res === ResponseStatus.NOT_FOUND) {
                    setError("Error fetching users");
                    setUsers([]);
                    setUserLength(0);
                } else if (typeof res === "object" && "users" in res) {
                    setUsers(res.users);
                    setUserLength(res.total_users);
                    setNoContent(false);
                    setError("");
                }
            })
            .finally(() => setLoading(false));
    }, [token, start, end]);

    const handleUserApprove = async (finKod: string) => {
        const res = await approveUser(finKod, token ? token : '');

        if (res === ResponseStatus.SUCCESS) {
            Swal.fire({
                icon: "success",
                title: "Uğurlu",
                text: "İstifadəçi uğurla təsdiq edildi.",
            });
        } else if (res === ResponseStatus.NOT_FOUND) {
            Swal.fire({
                icon: "error",
                title: "Xəta ",
                text: "Sorğu üçün fin kod tapılmadı.",
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Xəta",
                text: "Gözlənilməz xəta yenidən cəhd edin.",
            });
        }
    };

    const rejectUserApprove = async (finKod: string) => {
        const res = await rejectUser(finKod, token ? token : '');

        if (res === ResponseStatus.SUCCESS) {
            Swal.fire({
                icon: "success",
                title: "Uğurlu",
                text: "İstifadəçi uğurla ləğv edildi.",
            });
        } else if (res === ResponseStatus.NOT_FOUND) {
            Swal.fire({
                icon: "error",
                title: "Xəta ",
                text: "Sorğu üçün fin kod tapılmadı.",
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Xəta",
                text: "Gözlənilməz xəta yenidən cəhd edin.",
            });
        }
    }

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
                                    Qeydiyyat tarixi
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
                                    Təsdiq et
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Ləğv et
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {[...Array(5)].map((_, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="px-4 py-3">
                                        <Skeleton variant="rounded" height={28} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <Skeleton variant="rounded" height={28} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <Skeleton variant="rounded" height={28} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <Skeleton variant="rounded" height={28} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        <Skeleton variant="circular" width={40} height={40} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        <Skeleton variant="circular" width={40} height={40} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center">
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
                                        Qeydiyyat tarixi
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
                                        Təsdiq et
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Ləğv et
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            {/* Table Body */}
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {noContent ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                                            Təsdiq gözləyən istifadəçi yoxdur
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
                                            {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {user?.faculty_name}
                                        </TableCell> */}
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
                                            <TableCell className="px-4 py-3 text-start">
                                                <div className="inline-flex items-center justify-center w-10 h-10 rounded-[5px] bg-green-500 text-green dark:bg-green cursor-pointer" onClick={() => handleUserApprove(user.fin_kod)}>
                                                    <DoneIcon className="text-white dark:text-white" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <div className="inline-flex items-center justify-center w-10 h-10 rounded-[5px] bg-red-500 text-red dark:bg-red cursor-pointer" onClick={() => rejectUserApprove(user.fin_kod)}>
                                                    <DeleteIcon className="text-white dark:text-white" />
                                                </div>
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
                                getApproveWaitingUsers(token ? token : '', newStart, newEnd)
                                    .then((res) => {
                                        if (res === ResponseStatus.NO_CONTENT) {
                                            setNoContent(true);
                                            setUsers([]);
                                            setUserLength(0);
                                        } else if (res === ResponseStatus.ERROR || res === ResponseStatus.NOT_FOUND) {
                                            setError("Error fetching users");
                                            setUsers([]);
                                            setUserLength(0);
                                        } else if (typeof res === "object" && "users" in res) { // type narrowing
                                            setUsers(res.users);
                                            setUserLength(res.total_users);
                                            setNoContent(false);
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
            ) : null}
        </>
    );
}
