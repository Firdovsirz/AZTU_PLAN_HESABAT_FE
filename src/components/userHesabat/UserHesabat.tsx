import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Label from "../form/Label";
import { Modal } from "../ui/modal";
import Stack from '@mui/material/Stack';
import Button from "../ui/button/Button";
import { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import Pagination from '@mui/material/Pagination';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CircularProgress from "@mui/material/CircularProgress";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Hesabat, getHesabatByFinKod } from "../../services/hesabat/hesabatService";

interface UserPlanProps {
    finKod?: string;
}

export default function UserHesabat({ finKod }: UserPlanProps) {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(3);
    const [hesabatLength, setHesabatLength] = useState();
    const { isOpen, openModal, closeModal } = useModal();
    const [hesabats, setHesabats] = useState<Hesabat[] | undefined>([]);

    useEffect(() => {
        if (finKod) {
            getHesabatByFinKod(finKod, start, end)
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
        }
    }, [finKod]);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full h-full py-10">
                <CircularProgress />
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
                    İstifadəçi üçün hesbat tərtib edilməyib.
                </p>
            </div>
        );
    };

    const handleViewModal = () => {
        openModal();
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
                                    <TableRow>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {hesabat?.fin_kod}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {hesabat.work_plan_serial_number}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {hesabat.activity_type_code}
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
                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-[5px] bg-yellow-200 text-yellow-400 dark:bg-yellow-400 cursor-pointer" onClick={handleViewModal}>
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
                        count={hesabatLength ? (hesabatLength <= 1 ? 1 : Math.ceil(hesabatLength / 1)) : 1}
                        page={Math.floor(start / (end - start)) + 1}
                        onChange={(_event, page) => {
                            if (!finKod) return;
                            const pageSize = end - start;
                            const newStart = (page - 1) * pageSize;
                            const newEnd = newStart + pageSize;
                            setStart(newStart);
                            setEnd(newEnd);
                            setLoading(true);
                            getHesabatByFinKod(finKod, newStart, newEnd)
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
                                });
                        }}
                    />
                </Stack>
            </div>
            {/* <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            İş Planı
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            İş planı haqqında ətraflı məlumat
                        </p>
                    </div>
                    <form className="flex flex-col">
                        <div className="px-2 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div>
                                    <Label>Fin Kod</Label>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {hesabat?.fin_kod}
                                    </p>
                                </div>

                                <div>
                                    <Label>Plan nömrəsi</Label>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {hesabat?.work_plan_serial_number}
                                    </p>
                                </div>

                                <div>
                                    <Label>Fəaliyyət növü</Label>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {hesabat?.activity_type_code}
                                    </p>
                                </div>

                                <div>
                                    <Label>Qiymətləndirmə</Label>
                                    {!hesabat.assessment_score ? (
                                        <p className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                            Təyin edilməyib
                                        </p>
                                    ) : (
                                        <>
                                            {hesabat?.assessment_score}
                                        </>
                                    )}
                                </div>
                                <div>
                                    <Label>Admin qiymətləndirməsi</Label>
                                    {!hesabat.admin_assessment ? (
                                        <p className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                            Təyin edilməyib
                                        </p>
                                    ) : (
                                        <>
                                            {hesabat?.assessment_score}
                                        </>
                                    )}
                                </div>
                                <div>
                                    <Label>Süni intellekt qiymətləndirməsi</Label>
                                    {!hesabat.ai_assessment ? (
                                        <p className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                            Təyin edilməyib
                                        </p>
                                    ) : (
                                        <>
                                            {hesabat.assessment_score}
                                        </>
                                    )}
                                </div>
                                <div>
                                    <Label>İşin vaxt təhlili</Label>
                                    {!hesabat.duration_analysis ? (
                                        <p className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                            Məlumat yoxdur
                                        </p>
                                    ) : (
                                        <>
                                            {hesabat.duration_analysis === 1 ? (
                                                <p className="bg-green-200 dark:bg-green-600 text-green-900 dark:text-green-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                    Vaxtında təhvil verilib
                                                </p>
                                            ) : hesabat.duration_analysis === 0 ? (
                                                <p className="bg-red-200 dark:bg-red-600 text-red-900 dark:text-red-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                    Vaxtında təhvil verilməyib
                                                </p>
                                            ) : (
                                                <p className="bg-green-200 dark:bg-green-600 text-green-900 dark:text-green-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                    Vaxtından əvvəl təhvil verilməyib
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div>
                                    <Label>Hesabat sənədi</Label>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {!hesabat.activity_doc_path ? (
                                            <p className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                Fayl yüklənməyib
                                            </p>
                                        ) : (
                                            <div className="flex justify-cetner items-center">
                                                <div style={{
                                                    border: "1px solid gray",
                                                    padding: 10,
                                                    borderRadius: 10
                                                }}>
                                                    Fayl adı
                                                </div>
                                                <Button className="ml-[20px]">
                                                    <FileDownloadIcon />
                                                </Button>
                                            </div>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal> */}
        </>
    );
}
