import Swal from "sweetalert2";
import Label from "../form/Label";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import { useSelector } from "react-redux";
import Input from "../form/input/InputField";
import DatePicker from "../form/date-picker";
import TextArea from "../form/input/TextArea";
import { RootState } from "../../redux/store";
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

    // form data

    // const [finKod, setFinKod] = useState("");
    const [workYear, setWorkYear] = useState(2025);
    const [activityTypeCode, setActivityTypeCode] = useState<number | null>(null);
    const [workDesc, setWorkDesc] = useState("");
    const [deadline, setDeadline] = useState("");
    const [activityTypeName, setActivityTypeName] = useState("");

    useEffect(() => {
        getActivities()
            .then(setActivities)
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const maxCode = activities.length > 0 ? Math.max(...activities.map((a) => a.actvity_type_code)) : 0;

    const activityOptions = useMemo(() => {
        const options = activities.map((activity) => ({
            value: String(activity.actvity_type_code),
            label: activity.activity_type_name,
        }));
        const maxCode = activities.length > 0 ? Math.max(...activities.map((a) => a.actvity_type_code)) : 0;
        options.push({ value: String(maxCode + 1), label: "Digər" });
        return options;
    }, [activities]);

    const handleSelectChange = (value: string) => {
        setActivityTypeCode(+value);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        if (finKod){
            formData.append("fin_kod", finKod);
        }
        formData.append("work_year", String(workYear));
        formData.append("activity_type_code", String(activityTypeCode));
        formData.append("work_desc", workDesc);
        formData.append("deadline", deadline);

        try {
            if (activityTypeName.length !== 0) {
                const activityResult = await createActivity(activityTypeName);
                if (activityResult !== "SUCCESS") {
                    throw new Error("Activity creation failed");
                }
                formData.append("activity_type_name", activityTypeName);
            }

            const result = await createPlan(formData);

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

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full h-full py-10">
                <CircularProgress />
            </div>
        );
    };

    return (
        <>
            <form action="" onSubmit={handleCreate}>
                <div className="flex justify-between items-center w-full mb-[20px]">
                    <div style={{
                        width: "calc((100% / 2) - 10px)"
                    }}>
                        <Label htmlFor="input">Fin Kod</Label>
                        <Input type="text" id="input" value={finKod ? finKod : ""} disabled readOnly/>
                    </div>
                    <div style={{
                        width: "calc((100% / 2) - 10px)"
                    }}>
                        <Label htmlFor="inputTwo">İş ili</Label>
                        <Input type="text" id="inputTwo" value={String(workYear)} onChange={(e) => { setWorkYear(+e.target.value) }} />
                    </div>
                </div>
                <div className="flex justify-between items-center w-full mb-[20px]">
                    <div style={{
                        width: "calc((100% / 2) - 10px)"
                    }}>
                        <Label>Fəaliyyət növü</Label>
                        <Select
                            options={activityOptions}
                            placeholder="Fəaliyyət növü seçin"
                            onChange={handleSelectChange}
                            className="dark:bg-dark-900"
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
                    {activityTypeCode === maxCode + 1 ? (
                        <div style={{
                            width: "calc((100% / 2) - 10px)"
                        }}>
                            <Label htmlFor="input">Fəaliyyət növü (Fəaliyyət növünüzü əsaslandırın)</Label>
                            <Input type="text" id="input" placeholder="Fəaliyyət növü" value={activityTypeName} onChange={(e) => { setActivityTypeName(e.target.value) }} />
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
