import {
    Table,
    TableCell,
    TableBody,
    TableHeader,
    TableRow
} from "../ui/table";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { RootState } from "../../redux/store";
import VisibilityIcon from '@mui/icons-material/Visibility';
import CircularProgress from "@mui/material/CircularProgress";
import { getPlanByFinKod, Plan } from "../../services/plan/plan";
import { getActivityByCode } from "../../services/activity/activityService";

export default function MyPlan() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [plans, setPlans] = useState<Plan[] | null>(null);
    const [activityNames, setActivityNames] = useState<{ [key: number]: string }>({});
    const finKod = useSelector((state: RootState) => state.auth.fin_kod);
    const navigate = useNavigate();

    useEffect(() => {
        if (finKod) {
            getPlanByFinKod(finKod)
                .then(
                    (res) => {
                        if (res === "Not found") {
                            setNotFound(true);
                        } else if (res === "error") {
                            setError(res);
                        } else {
                            setPlans(res);
                        }
                    }
                )
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [finKod]);

    const getActivityNameByCode = async (activityCode: number) => {
        if (activityNames[activityCode]) {
            return activityNames[activityCode];
        }

        try {
            const res = await getActivityByCode(activityCode);
            let name = "Gözlənilməz xəta";
            if (res === "Not found") {
                name = "Mismatch";
            } else if (res !== "error") {
                name = res;
            }

            setActivityNames(prev => ({ ...prev, [activityCode]: name }));
            return name;
        } catch (err) {
            return "Gözlənilməz xəta";
        }
    };

    useEffect(() => {
        const loadActivityNames = async () => {
            if (plans) {
                const uniqueCodes = Array.from(new Set(plans.map(p => p.activity_type_code)));
                const activityMap: { [key: number]: string } = {};

                for (const code of uniqueCodes) {
                    const name = await getActivityNameByCode(code);
                    activityMap[code] = name;
                }

                setActivityNames(activityMap);
            }
        };

        loadActivityNames();
    }, [plans]);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full h-full py-10">
                <CircularProgress />
            </div>
        );
    };

    if (notFound || !plans || plans.length === 0) {
        return (
            <div className="w-full flex justify-center items-center">
                Hesabat not found.
            </div>
        );
    }

    return (
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
                                İşin sıra sayı
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                İcra tarixi
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
                        {plans?.map((plan, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {plan.fin_kod}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {plan.work_plan_serial_number}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {activityNames[plan.activity_type_code] || <CircularProgress size={16} />}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {plan.work_row_number}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {plan.work_year}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div onClick={() => {
                                            navigate("/my-plan-details", { state: plan.work_plan_serial_number })
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
    )
}
