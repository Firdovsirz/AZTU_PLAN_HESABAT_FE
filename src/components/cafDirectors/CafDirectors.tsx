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
import { AllUser, ResponseStatus, getCafDirectors } from "../../services/user/user";

export default function CafDirectors() {
    const [error, setError] = useState("");
    const [end, setEnd] = useState<number>(10);
    const [loading, setLoading] = useState(true);
    const [start, setStart] = useState<number>(0);
    const [noContent, setNoContent] = useState(false);
    const [directorLegth, setDirectorLength] = useState<number>(0);
    const [cafDirectors, setCafDirectors] = useState<AllUser[]>([]);

    useEffect(() => {
        getCafDirectors(start, end)
            .then((res) => {
                if (res === ResponseStatus.NO_CONTENT) {
                    setNoContent(true);
                } else if (res === "ERROR") {
                    setError("Error fetching users");
                } else if (Array.isArray(res.caf_directors)) {
                    setCafDirectors(res.caf_directors);
                    setDirectorLength(res.total_caf_directors);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);
    if (loading) {
        return (
            <div className="flex justify-center items-center w-full h-full py-10">
                <CircularProgress />
            </div>
        );
    };

    console.log(cafDirectors);

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
                                    İcraçı statusu
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Qeydiyyat tarixi
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
                            {Array.isArray(cafDirectors) && cafDirectors?.map((dekan, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {dekan?.name} {dekan?.surname} {dekan?.father_name}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {dekan?.fin_kod}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {dekan?.duty_name ? (
                                                <>
                                                    {dekan?.duty_name}
                                                </>
                                            ) : (
                                                <p className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                    Mövcud deyil
                                                </p>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {dekan?.faculty_code ? (
                                                <>
                                                    {dekan?.faculty_code}
                                                </>
                                            ) : (
                                                <p className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                    Mövcud deyil
                                                </p>
                                            )}
                                        </TableCell>
                                        {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {(() => {
                                                if (!dekan?.created_at) return "Mövcud deyil";
                                                const createdDate = new Date(dekan.created_at);
                                                const today = new Date();
                                                const yesterday = new Date();
                                                yesterday.setDate(today.getDate() - 1);

                                                const isToday = createdDate.toDateString() === today.toDateString();
                                                const isYesterday = createdDate.toDateString() === yesterday.toDateString();

                                                if (isToday) return "Bugün";
                                                if (isYesterday) return "Dünən";
                                                return createdDate.toISOString().split("T")[0].replace(/-/g, "/");
                                            })()}
                                        </TableCell> */}
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {dekan.is_execution ? (
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
                                            <Link to={`/user/${dekan?.fin_kod}`}>
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
            {cafDirectors.length !== 0 ? (
                <div className="w-full flex justify-center items-center">
                    <Stack spacing={2}>
                        <Pagination
                            count={directorLegth ? (directorLegth <= 10 ? 1 : Math.ceil(directorLegth / 10)) : 1}
                            page={Math.floor(start / (end - start)) + 1}
                            onChange={(_event, page) => {
                                const pageSize = end - start;
                                const newStart = (page - 1) * pageSize;
                                const newEnd = newStart + pageSize;
                                setStart(newStart);
                                setEnd(newEnd);
                                setLoading(true);
                                getCafDirectors(newStart, newEnd)
                                    .then((res) => {
                                        if (res === "ERROR") {
                                            setError("Not found");
                                            setCafDirectors([]);
                                        } else if (res === "NO CONTENT") {
                                            setError("no user");
                                            setCafDirectors([]);
                                        } else {
                                            setCafDirectors(res.caf_directors);
                                            setDirectorLength(res.total_caf_directors);
                                            setError("");
                                        }
                                    })
                                    .finally(() => {
                                        setLoading(false);
                                    });
                            }}
                        />
                    </Stack>
                </div>
            ) : null}
        </>
    );
}
