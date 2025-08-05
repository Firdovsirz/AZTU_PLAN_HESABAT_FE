import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Swal from "sweetalert2";
import { Link } from "react-router";
import Stack from '@mui/material/Stack';
import { useEffect, useState } from "react";
import DoneIcon from '@mui/icons-material/Done';
import Pagination from '@mui/material/Pagination';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CircularProgress from "@mui/material/CircularProgress";
import { getApproveWaitingUsers, User, ResponseStatus, approveUser, rejectUser } from "../../services/user/user";

export default function ApproveWaitingUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [noContent, setNoContent] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        getApproveWaitingUsers()
            .then((res) => {
                if (res === ResponseStatus.NO_CONTENT) {
                    setNoContent(true);
                } else if (res === ResponseStatus.ERROR || res === ResponseStatus.NOT_FOUND) {
                    setError("Error fetching users");
                } else if (Array.isArray(res)) {
                    setUsers(res);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleUserApprove = async (finKod: string) => {
        const res = await approveUser(finKod);

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
        const res = await rejectUser(finKod);

        if (res === ResponseStatus.SUCCESS) {
            Swal.fire({
                icon: "success",
                title: "Uğurlu",
                text: "İstifadəçi uğurla Ləğv edildi.",
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
            <div className="flex justify-center items-center w-full h-full py-10">
                <CircularProgress />
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
                                    <TableCell>
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
            {users.length !== 0 ? (
                <div className="w-full flex justify-center items-center">
                    <Stack spacing={2}>
                        <Pagination count={10} />
                    </Stack>
                </div>
            ) : null
            }
        </>
    );
}
