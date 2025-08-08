import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Link } from "react-router";
import Stack from '@mui/material/Stack';
import { useEffect, useState } from "react";
import Pagination from '@mui/material/Pagination';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CircularProgress from "@mui/material/CircularProgress";
import { getExecutionUsers, User } from "../../services/user/user";

export default function ReportUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(10);
    const [userLength, setUserLength] = useState<number | null>(null);

    useEffect(() => {
        getExecutionUsers(start, end)
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

    // if (loading) {
    //     return (
    //         <div className="flex justify-center items-center w-full h-full py-10">
    //             <CircularProgress />
    //         </div>
    //     );
    // };

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
                                                {user?.duty_code ? (
                                                    <>
                                                        {user?.duty_code}
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
                                                {user?.created_at}
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
                            getExecutionUsers(newStart, newEnd)
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
                    />
                </Stack>
            </div>
        </>
    );
}
