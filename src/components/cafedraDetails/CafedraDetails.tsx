import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Link } from "react-router";
import Stack from '@mui/material/Stack';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import DeleteIcon from '@mui/icons-material/Delete';
import NotFoundImg from "../../../public/not-found.png";
import VisibilityIcon from '@mui/icons-material/Visibility';
import CircularProgress from "@mui/material/CircularProgress";
import { getCafDetails, CafedraDetailsInterface, CafedraUser } from '../../services/cafedra/cafedraService';
import { getCafUsers } from '../../services/cafedra/cafedraService';

export default function CafedraDetails() {
    const { cafedra_code } = useParams();
    const [cafDetails, setCafDetails] = useState<CafedraDetailsInterface[] | string>([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<CafedraUser[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (cafedra_code) {
            getCafDetails(cafedra_code)
                .then(setCafDetails)

            getCafUsers(cafedra_code)
                .then((res) => {
                    if (typeof res === "string") {
                        if (res === "No user") {
                            setError(res);
                        } else {
                            setError("Unexpected error");
                        }
                    } else {
                        setUsers(res);
                    }
                })
                .finally(() => {
                    setLoading(false);
                })
        }
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full h-full py-10">
                <CircularProgress />
            </div>
        );
    };
    return (
        <div>
            {typeof cafDetails !== "string" && (
                <>
                <h2 className="mb-2 font-semibold text-gray-800 text-xs dark:text-white/90 sm:text-xl">
                    Kafedra adı: {cafDetails[0]?.cafedra_name} ({cafedra_code})
                </h2>
                <h2 className="mb-2 font-semibold text-gray-800 text-xs dark:text-white/90 sm:text-xl">
                    Fakültə: {cafDetails[0]?.faculty_code}
                </h2>
                </>
            )}
            {error === "No user" ? (
                <div className="w-full flex justify-center items-center">
                    <img src={NotFoundImg} alt="not found" className="w-[80px] mr-[20px]" />
                    <h2 className="mb-2 font-semibold text-gray-600 text-xs dark:text-white/90 sm:text-xl">
                        İstifadəçi tapılmadı
                    </h2>
                </div>
            ) : (
                <>
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] mt-[30px]">
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
                                            İcraçı statusu
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
                                            Sil
                                        </TableCell>
                                    </TableRow>
                                </TableHeader>

                                {/* Table Body */}
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {users.map((user, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                <div className="flex items-center gap-3">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {user.name} {user.surname} {user.father_name}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {user.fin_kod}
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
                                                <Link to={`/user/${user.fin_kod}`}>
                                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-[5px] bg-yellow-200 text-yellow-400 dark:bg-yellow-400 cursor-pointer">
                                                        <VisibilityIcon className="text-yellow-500 dark:text-yellow-700" />
                                                    </div>
                                                </Link>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <div className="inline-flex items-center justify-center w-10 h-10 rounded-[5px] bg-red-500 text-red dark:bg-red cursor-pointer">
                                                    <DeleteIcon className="text-white dark:text-white" />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    <div className="w-full flex justify-center items-center mt-[20px]">
                        <Stack spacing={2}>
                            <Pagination
                                count={10}
                                sx={{
                                    "& .MuiPaginationItem-root": {
                                        color: "white"
                                    },
                                    "& .Mui-selected": {
                                        backgroundColor: "rgb(67, 88, 251)",
                                        color: "white",
                                        "&:hover": {
                                            backgroundColor: "rgb(67, 88, 251)"
                                        }
                                    }
                                }}
                            />
                        </Stack>
                    </div>
                </>
            )}
        </div>
    )
}
