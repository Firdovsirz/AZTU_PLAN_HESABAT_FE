import Swal from "sweetalert2";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import { RootState } from "../../redux/store";
import Skeleton from "@mui/material/Skeleton";
import MultiSelect from "../form/MultiSelect";
import DoneIcon from '@mui/icons-material/Done';
import { useEffect, useState, useMemo } from "react";
import { updatePlan } from "../../services/plan/plan";
import CircularProgress from "@mui/material/CircularProgress";
import { createActivity } from "../../services/activity/activityService";
import { getPlanBySerialNumber, SinglePlan } from "../../services/plan/plan";
import { Activity, getActivities } from "../../services/activity/activityService";

export default function EditPlan() {
    const location = useLocation();
    const { work_plan_serial_number } = location.state ?? "";
    console.log(work_plan_serial_number);
    const [, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [plan, setPlan] = useState<SinglePlan>();
    const [, setNotFound] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activities, setActivities] = useState<Activity[]>([]);
    const finKod = useSelector((state: RootState) => state.auth.fin_kod);
    const token = useSelector((state: RootState) => state.auth.token);

    // form data

    const [activityTypeCodes, setActivityTypeCodes] = useState<string[]>([]);
    const [activityTypeName, setActivityTypeName] = useState("");
    const [selectedActivityTypeNames, setSelectedActivityTypeNames] = useState<string[]>([]);

    useEffect(() => {
        getActivities(finKod ? finKod : "", token ? token : '')
            .then(setActivities)
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!work_plan_serial_number || !token) return;

        setLoading(true);

        getPlanBySerialNumber(work_plan_serial_number, token)
            .then((data) => {
                if (data === "ERROR") {
                    setError(true);
                } else if (data === "NOT FOUND") {
                    setNotFound(true);
                } else if (data && typeof data === "object") {
                    console.log(data);
                    setPlan(data);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [work_plan_serial_number, token]);

    const maxCode = activities.length > 0 ? Math.max(...activities.map((a) => a.actvity_type_code)) : 0;

    const activityOptions = useMemo(() => {
        const options = activities.map((activity) => ({
            value: String(activity.actvity_type_code),
            text: activity.activity_type_name,
            selected: false
        }));
        const maxCode = activities.length > 0 ? Math.max(...activities.map((a) => a.actvity_type_code)) : 0;
        options.push({ value: String(maxCode + 1), text: "Digər", selected: false });
        return options;
    }, [activities]);

const handleSelectChange = (values: string[]) => {
    setActivityTypeCodes(values);

    const selectedNames = activityOptions
        .filter(option => values.includes(option.value))
        .map(option => option.text);

    setSelectedActivityTypeNames(selectedNames);
};

    const handleCreateActivity = async () => {
        if (activityTypeName.trim() === "") {
            Swal.fire({
                icon: "error",
                title: "Xəta baş verdi",
                text: "Fəaliyyət növünü qeyd edin.",
                confirmButtonText: "Bağla"
            });
            return;
        }

        const activityResult = await createActivity(activityTypeName, finKod ? finKod : "", token ? token : '');

        if (typeof activityResult === "object" && activityResult.status === "SUCCESS") {
            if (typeof activityResult === "object" && activityResult.status === "SUCCESS") {
                const newActivity: Activity = {
                    id: activityResult.activity.id,
                    actvity_type_code: activityResult.activity.activity_type_code,
                    activity_type_name: activityResult.activity.activity_type_name,
                    created_at: activityResult.activity.created_at
                };

                setActivities(prev => [...prev, newActivity]);

                setActivityTypeCodes(prev =>
                    prev.map(code => code === String(maxCode + 1) ? String(newActivity.actvity_type_code) : code)
                );

                setActivityTypeName("");

                Swal.fire({
                    icon: "success",
                    title: "Fəaliyyət növü uğurla yaradıldı",
                    confirmButtonText: "OK"
                });
            }

        } else if (activityResult === "ACTIVITY EXISTS") {
            Swal.fire({
                icon: "error",
                title: "Xəta baş verdi",
                text: "Fəaliyyət növü artıq mövcuddur.",
                confirmButtonText: "Bağla"
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Xəta baş verdi",
                text: "Fəaliyyət növü yaradılarkən problem yarandı. Yenidən cəhd edin.",
                confirmButtonText: "Bağla"
            });
        }

    };

    const handleUpdatePlan = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const res = await updatePlan(work_plan_serial_number, activityTypeCodes, selectedActivityTypeNames, token ? token : "");

            if (res === "SUCCESS") {
                setPlan(prev => prev ? {
                    ...prev,
                    activities: [...(prev.activities || []), ...selectedActivityTypeNames]
                } : prev);

                Swal.fire({
                    icon: "success",
                    title: "Plan uğurla yeniləndi.",
                }).then(() => {
                    setIsSubmitting(false);
                })
            } else if (res === "PLAN NOT FOUND") {
                Swal.fire({
                    icon: "error",
                    title: "Planda dəyişiklik edərkən problem yarandı.",
                    text: "Plan mövcud deyil.",
                }).then(() => {
                    setIsSubmitting(false);
                })
            } else if (res === "CONFLICT") {
                Swal.fire({
                    icon: "error",
                    title: "Təkrar fəaliyyət növü.",
                    text: "Plan üçün eyni fəaliyyət növü əlavə edilə bilməz.",
                }).then(() => {
                    setIsSubmitting(false);
                })
            } else if (res === "ERROR") {
                Swal.fire({
                    icon: "error",
                    title: "Planda dəyişiklik edərkən problem yarandı.",
                    text: "Yenidən cəhd edin.",
                }).then(() => {
                    setIsSubmitting(false);
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Planda dəyişiklik edərkən problem yarandı.",
                    text: "Yenidən cəhd edin.",
                }).then(() => {
                    setIsSubmitting(false);
                })
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Planda dəyişiklik edərkən problem yarandı.",
                text: "Yenidən cəhd edin.",
            }).then(() => {
                    setIsSubmitting(false);
                })
        }
    };

    if (loading) {
        return (
            <form className="w-full space-y-5 py-10">
                <div className="flex justify-between items-center w-full mb-[20px]">
                    <Skeleton variant="rectangular" width="calc((100% / 2) - 10px)" height={56} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width="calc((100% / 2) - 10px)" height={56} sx={{ borderRadius: 1 }} />
                </div>
                <div className="flex justify-between items-center w-full mb-[20px]">
                    <Skeleton variant="rectangular" width="calc((100% / 2) - 10px)" height={56} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width="calc((100% / 2) - 10px)" height={56} sx={{ borderRadius: 1 }} />
                </div>
                <div className="flex justify-between items-center w-full mb-[20px]">
                    <Skeleton variant="rectangular" width="calc((100% / 2) - 10px)" height={56} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width="calc((100% / 2) - 10px)" height={56} sx={{ borderRadius: 1 }} />
                </div>
                <div className="w-full flex justify-center items-center">
                    <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
                </div>
            </form>
        );
    };

    return (
        <>
            <form onSubmit={handleUpdatePlan}>
                <div className="mb-[20px]">
                    <p className="text-gray-700 dark:text-gray-300">
                        Siz planı redaktə edərkən yalnız yeni fəaliyyət növü əlavə edə bilərsiz!
                    </p>
                </div>
                <div className="mb-[10px]">
                    <Label htmlFor="input">Fəaliyyət növləri</Label>
                    {loading ? (
                        <>
                            <Skeleton variant="rectangular" width={120} height={30} sx={{ borderRadius: "20px", display: "inline-block", marginRight: "8px", marginBottom: "8px" }} />
                            <Skeleton variant="rectangular" width={150} height={30} sx={{ borderRadius: "20px", display: "inline-block", marginRight: "8px", marginBottom: "8px" }} />
                            <Skeleton variant="rectangular" width={100} height={30} sx={{ borderRadius: "20px", display: "inline-block", marginRight: "8px", marginBottom: "8px" }} />
                        </>
                    ) : (
                        plan?.activities.map((activity, index) => (
                            <div
                                className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-[20px] px-3 py-2 mb-2 mr-2"
                                key={index}
                            >
                                {activity}
                            </div>
                        ))
                    )}
                </div>
                <div className="flex justify-between items-center w-full mb-[20px]">
                    <div style={{
                        width: "calc((100% / 2) - 10px)"
                    }}>
                        <Label htmlFor="input">Fin Kod</Label>
                        <Input type="text" id="input" value={finKod ? finKod : ""} disabled readOnly />
                    </div>
                    <div style={{
                        width: "calc((100% / 2) - 10px)"
                    }}>
                        <Label htmlFor="inputTwo">İş ili</Label>
                        <Input type="text" id="inputTwo" value={String(plan?.work_year)} readOnly />
                    </div>
                </div>
                <div className="flex justify-between items-center w-full mb-[20px]">
                    <div
                        style={{
                            width: "calc((100% / 2) - 10px)",
                            minHeight: "40px",
                            height: "auto",
                        }}
                    >
                        <MultiSelect
                            options={activityOptions}
                            label="Fəaliyyət növü seçin"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div style={{
                        width: "calc((100% / 2) - 10px)"
                    }}>
                        <Input
                            value={
                                plan?.deadline
                                    ? new Date(plan.deadline).toLocaleDateString("en-GB")
                                    : ""
                            }
                            readOnly
                        />
                    </div>
                </div>
                <div className="flex justify-between items-center w-full mb-[20px]">
                    {activityTypeCodes.includes(String(maxCode + 1)) ? (
                        <div style={{
                            width: "calc((100% / 2) - 10px)",
                        }}>
                            <Label htmlFor="input">Fəaliyyət növü (Fəaliyyət növünüzü əsaslandırın)</Label>
                            <div className="relative w-full">
                                <Input type="text" id="input" placeholder="Fəaliyyət növü" value={activityTypeName} onChange={(e) => { setActivityTypeName(e.target.value) }} />
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-[5px] bg-green-600 dark:bg-green-400 cursor-pointer text-white">
                                        <DoneIcon onClick={handleCreateActivity} />
                                    </div>
                                </span>
                            </div>
                        </div>
                    ) : null}
                    <div style={{
                        width: "calc((100% / 2) - 10px)"
                    }}>
                        <Label htmlFor="input">İşin qısa təsviri</Label>
                        <TextArea rows={1} value={plan?.work_desc} disabled />
                    </div>
                </div>
                <div className="w-full flex justify-center items-center">
                    <Button>
                        {isSubmitting ? (
                            <>
                                <CircularProgress size={20} /> Yüklənir...
                            </>
                        ) : (
                            "Təsdiq et"
                        )}
                    </Button>
                </div>
            </form>
        </>
    )
}