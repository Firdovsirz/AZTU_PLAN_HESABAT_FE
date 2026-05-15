import Swal from "sweetalert2";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { useSelector } from "react-redux";
import Input from "../form/input/InputField";
import DatePicker from "../form/date-picker";
import TextArea from "../form/input/TextArea";
import { RootState } from "../../redux/store";
import Skeleton from "@mui/material/Skeleton";
import MultiSelect from "../form/MultiSelect";
import DoneIcon from '@mui/icons-material/Done';
import { createPlan } from "../../services/plan/plan";
import React, { useEffect, useState, useMemo } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { createActivity } from "../../services/activity/activityService";
import { Activity, getActivities } from "../../services/activity/activityService";

export default function NewPlan() {
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activities, setActivities] = useState<Activity[]>([]);
    const finKod = useSelector((state: RootState) => state.auth.fin_kod);
    const token = useSelector((state: RootState) => state.auth.token);

    // form data

    const [workYear, setWorkYear] = useState(2025);
    const [activityTypeCodes, setActivityTypeCodes] = useState<string[]>([]);
    const [workDesc, setWorkDesc] = useState("");
    const [deadline, setDeadline] = useState("");
    const [activityTypeName, setActivityTypeName] = useState("");

    useEffect(() => {
        getActivities(finKod ? finKod : "", token ? token : '')
            .then((result) => {
                setActivities(Array.isArray(result) ? result : []);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

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
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        if (finKod) {
            formData.append("fin_kod", finKod);
        }
        formData.append("work_year", String(workYear));
        activityTypeCodes.forEach(code => {
            formData.append("activity_type_code", code);
        });
        formData.append("work_desc", workDesc);
        formData.append("deadline", deadline);

        try {
            const result = await createPlan(formData, token ? token : '');

            if (result === "SUCCESS") {
                Swal.fire({
                    icon: "success",
                    title: "Plan uğurla yaradıldı",
                    confirmButtonText: "OK"
                });
            } else {
                throw new Error("Plan creation failed");
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Xəta baş verdi",
                text: "Plan yaradılarkən problem yarandı.",
                confirmButtonText: "Bağla"
            });
        } finally {
            setIsSubmitting(false);
        }
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
            <form
                onSubmit={handleCreate}
            >
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
                        <Input type="text" id="inputTwo" value={String(workYear)} onChange={(e) => { setWorkYear(+e.target.value) }} />
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
                        <DatePicker
                            id="date-picker"
                            label="Son tarix"
                            placeholder="Tarix seçin"
                            value={deadline}
                            onChange={(dates, currentDateString) => {
                                setDeadline(currentDateString);
                                console.log(dates);
                            }}
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
                        <TextArea rows={1} value={workDesc} onChange={(value) => { setWorkDesc(value) }} placeholder="İşin qısa təsviri" />
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
