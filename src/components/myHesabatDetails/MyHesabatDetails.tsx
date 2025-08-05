import Swal from "sweetalert2";
import Label from "../form/Label";
import Select from "../form/Select";
import { Link } from "react-router";
import Button from "../ui/button/Button";
import { useLocation } from "react-router";
import Input from "../form/input/InputField";
import FileInput from "../form/input/FileInput";
import { useEffect, useState, useMemo } from "react";
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CircularProgress from "@mui/material/CircularProgress";
import { submitHesabat } from "../../services/hesabat/hesabatService";
import { getActivities, Activity } from "../../services/activity/activityService";
import { getAssessments, Assessment } from "../../services/assessment/assessmentService";
import { getHesabatBySerialNumber, Hesabat } from "../../services/hesabat/hesabatService";

export default function MyHesabatDetails() {
    const location = useLocation();
    const [docPath, setDocPath] = useState("");
    const [docName, setDocName] = useState("");
    const [loading, setLoading] = useState(true);
    const work_plan_serial_number = location.state;
    const [submitted, setSubmitted] = useState(false);
    const [hesabat, setHesabat] = useState<Hesabat>();
    const [donePercentage, setDonePercentage] = useState("");
    const [activities, setActivities] = useState<Activity[]>([]);
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [assessmentScore, setAssessmentScore] = useState<number | null>(null);
    const [activityTypeCode, setActivityTypeCode] = useState<number | null>(null);
    const [activityTypeName, setActivityTypeName] = useState<string | null>(null);


    useEffect(() => {
        getAssessments()
            .then(setAssessments);
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

    const assessmentOptions = useMemo(() => {
        const options = assessments.map((assessment) => ({
            value: String(assessment.assessment_score),
            label: `${assessment.score_name} (${assessment.assessment_score})`
        }));
        return options;
    }, [assessments]);

    useEffect(() => {
        getHesabatBySerialNumber(work_plan_serial_number)
            .then((res) => {
                setHesabat(res);
                setDocName(res.doc_name);
                setAssessmentScore(res.assessment_score);
                setActivityTypeCode(res.activity_type_code);
                setActivityTypeName(res.activity_type_name);
                setDonePercentage(res.done_percentage);
                setDocPath(res.activity_doc_path);
                setSubmitted(res.submitted);
            })
            .finally(() => {
                setLoading(false);

            });
    }, [work_plan_serial_number]);

    const handleActivityChange = (value: string) => {
        setActivityTypeCode(+value);
    };

    const handleAssessmentChange = (value: string) => {
        const numericValue = Number(value);
        setAssessmentScore(numericValue);

        let percentage = "";
        switch (numericValue) {
            case 1:
                percentage = "0% - 20%";
                break;
            case 2:
                percentage = "20% - 40%";
                break;
            case 3:
                percentage = "40% - 60%";
                break;
            case 4:
                percentage = "60% - 80%";
                break;
            case 5:
                percentage = "80% - 100%";
                break;
            default:
                percentage = "";
        }

        setDonePercentage(percentage);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("Selected file:", file.name);
            setUploadedFile(file);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full h-full py-10">
                <CircularProgress />
            </div>
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("done_percentage", donePercentage);
        if (hesabat?.work_plan_serial_number) {
            formData.append("work_plan_serial_number", hesabat?.work_plan_serial_number);
        }
        if (assessmentScore) {
            formData.append("assessment_score", assessmentScore.toString());
        };
        if (uploadedFile) {
            formData.append("activity_doc_path", uploadedFile);
        };

        const res = await submitHesabat(formData);
        setLoading(false);

        if (res === "SUCCESS") {
            Swal.fire({
                icon: "success",
                title: "Hesabat təqdim edildi",
                confirmButtonText: "OK"
            });
        } else if (res === "NOT FOUND") {
            Swal.fire({
                icon: "error",
                title: "Xəta baş verdi",
                confirmButtonText: "OK"
            });
        } else if (res === "ERROR") {
            Swal.fire({
                icon: "error",
                title: "Xəta baş verdi",
                confirmButtonText: "OK"
            });
        };
    };

    return (
        <div>
            <form className="flex flex-col" onSubmit={handleSubmit}>
                <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                    <div>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                            <div>
                                <Label>Fin Kod</Label>
                                <Input
                                    type="text"
                                    value={hesabat?.fin_kod}
                                    disabled
                                />
                            </div>

                            <div>
                                <Label>Fəaliyyət Növü</Label>
                                <Select
                                    options={activityOptions}
                                    defaultValue={activityTypeCode?.toString()}
                                    placeholder={!activityTypeCode ? "Təyin edilməyib" : activityTypeName?.toString()}
                                    onChange={handleActivityChange}
                                    className="dark:bg-dark-900"
                                    disabled={activityTypeCode ? true : false}
                                />
                            </div>

                            <div>
                                <Label>Qiymətləndirmə</Label>
                                <Select
                                    options={assessmentOptions}
                                    defaultValue={assessmentScore?.toString()}
                                    placeholder={!assessmentScore ? "Təyin edilməyib" : assessmentScore?.toString()}
                                    onChange={handleAssessmentChange}
                                    className="dark:bg-dark-900"
                                    disabled={assessmentScore ? true : false}
                                />
                            </div>

                            {activityTypeCode === maxCode + 1 ? (
                                <div style={{
                                    width: "calc((100% / 2) - 10px)"
                                }}>
                                    <Label htmlFor="input">Fəaliyyət növü (Fəaliyyət növünüzü əsaslandırın)</Label>
                                    <Input type="text" id="input" placeholder="Fəaliyyət növü" value={activityTypeName?.toString()} onChange={(e) => { setActivityTypeName(e.target.value) }} />
                                </div>
                            ) : null}

                            {docPath || docName ? (
                                <div style={{
                                    width: "100%",
                                }}>
                                    <Label>Yüklənən sənəd</Label>
                                    <div 
                                    className="flex justify-between items-center" 
                                    style={{
                                        border: "1px solid rgba(0, 0, 0, 0.2)",
                                        paddingInline: "10px",
                                        paddingBlock: "3px",
                                        borderRadius: 7,
                                    }}>
                                        <p className="mr-[20px]">{docName}</p>
                                       <div>
                                         <Link to={`/doc/${docPath}`}>
                                            <div
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-[5px] bg-yellow-200 text-yellow-400 dark:bg-yellow-400 cursor-pointer mr-[20px]">
                                                <VisibilityIcon className="text-yellow-500 dark:text-yellow-700" />
                                            </div>
                                        </Link>
                                        <a
                                          href={`${docPath}`}
                                          download={docName}
                                          className="inline-flex items-center justify-center w-8 h-8 rounded-[5px] bg-blue-600 dark:bg-yellow-400 cursor-pointer"
                                        >
                                          <DownloadIcon className="text-white" />
                                        </a>
                                       </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <Label>Fayl yükləyin (Hesabtınızı əsaslandırmaq üçün fayl yükləyin.)</Label>
                                    <FileInput onChange={handleFileChange} className="custom-class" />
                                </div>
                            )}

                            <div>
                                <Label>Hesabatın uğur faizi</Label>
                                <Input type="text" value={donePercentage} placeholder={donePercentage ? undefined : "Qiymətləndirmə seçin"} disabled={donePercentage ? true : false} />
                            </div>

                            <div>
                                <Label>Keyfiyyətin idarəolunması şöbəsinin qiyməti</Label>
                                <Input type="text" value={hesabat?.admin_assessment} placeholder={hesabat?.admin_assessment ? undefined : "Təyin edilməyib"} disabled />
                            </div>

                            <div>
                                <Label>Süni intellekt qiymətləndirməsi</Label>
                                <Input type="text" value={hesabat?.ai_assessment} placeholder={hesabat?.ai_assessment ? undefined : "Təyin edilməyib"} disabled />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center mt-[30px]">
                        <Button disabled={loading || submitted}>
                            {loading ? "Yüklənir..." : "Təsdiq et"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
