import { 
    getHesabatBySerialNumber, 
    Hesabat, 
    addAssessment, 
    doneHesabat, 
    updateAssessment 
} from "../../services/hesabat/hesabatService";
import Swal from "sweetalert2";
import Label from "../form/Label";
import Select from "../form/Select";
import { Link } from "react-router";
import Button from "../ui/button/Button";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import Input from "../form/input/InputField";
import { RootState } from "../../redux/store";
import Skeleton from "@mui/material/Skeleton";
import FileInput from "../form/input/FileInput";
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import { useEffect, useState, useMemo } from "react";
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { submitHesabat } from "../../services/hesabat/hesabatService";
import { getActivities, Activity } from "../../services/activity/activityService";
import { getAssessments, Assessment } from "../../services/assessment/assessmentService";

export default function MyHesabatDetails() {
    const location = useLocation();
    const [docPath, setDocPath] = useState("");
    const [docName, setDocName] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [hesabat, setHesabat] = useState<Hesabat>();
    const work_plan_serial_number = location.state ?? "";
    const [doneLoading, setDoneLoading] = useState(false);
    const [donePercentage, setDonePercentage] = useState("");
    const [activities, setActivities] = useState<Activity[]>([]);
    const role = useSelector((state: RootState) => state.auth.role);
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [assessmentLoading, setAssessmentLoading] = useState(false);
    const token = useSelector((state: RootState) => state.auth.token);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [adminAsessment, setAdminAssessment] = useState<number | null>(null);
    const [assessmentScore, setAssessmentScore] = useState<number | null>(null);
    const [activityTypeCode, setActivityTypeCode] = useState<number | null>(null);
    const [activityTypeName, setActivityTypeName] = useState<string | null>(null);
    const [updatableAssessment, setUpdatableAssessment] = useState<boolean>(false);
    const [newAdminAssessment, setNewAdminAssessment] = useState<number | null>(null);

    useEffect(() => {
        setLoading(true);
        getAssessments(token ? token : '')
            .then(setAssessments);
        getActivities(token ? token : '')
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
        getHesabatBySerialNumber(work_plan_serial_number, token ? token : '')
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
        // Skeleton layout mimicking the form
        return (
            <div className="flex flex-col">
                <form className="flex flex-col">
                    <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                        <div>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                {/* Fin Kod */}
                                <div>
                                    <Skeleton variant="rectangular" height={32} width="40%" sx={{ borderRadius: 2, mb: 1 }} />
                                    <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 2 }} />
                                </div>
                                {/* Fəaliyyət Növü */}
                                <div>
                                    <Skeleton variant="rectangular" height={32} width="40%" sx={{ borderRadius: 2, mb: 1 }} />
                                    <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 2 }} />
                                </div>
                                {/* Qiymətləndirmə */}
                                <div>
                                    <Skeleton variant="rectangular" height={32} width="40%" sx={{ borderRadius: 2, mb: 1 }} />
                                    <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 2 }} />
                                </div>
                                {/* File section */}
                                <div>
                                    <Skeleton variant="rectangular" height={32} width="60%" sx={{ borderRadius: 2, mb: 1 }} />
                                    <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 2 }} />
                                </div>
                                {/* Hesabatın uğur faizi */}
                                <div>
                                    <Skeleton variant="rectangular" height={32} width="60%" sx={{ borderRadius: 2, mb: 1 }} />
                                    <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 2 }} />
                                </div>
                                {/* Admin qiyməti */}
                                <div>
                                    <Skeleton variant="rectangular" height={32} width="80%" sx={{ borderRadius: 2, mb: 1 }} />
                                    <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 2 }} />
                                </div>
                                {/* AI qiyməti */}
                                <div>
                                    <Skeleton variant="rectangular" height={32} width="60%" sx={{ borderRadius: 2, mb: 1 }} />
                                    <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 2 }} />
                                </div>
                            </div>
                        </div>
                        {/* Skeleton button(s) */}
                        <div className="flex justify-center items-center mt-[30px]">
                            <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 2, mr: 2 }} />
                            <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 2 }} />
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await Swal.fire({
            title: "Təsdiq",
            text: "Hesabatı təqdim etmək istədiyinizdən əminsiniz? Təqdim edildikdən sonra heç bir dəyişiklik etməyə icazə verilməyəcək!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Bəli, təqdim et",
            cancelButtonText: "İmtina et"
        });

        if (result.isConfirmed) {
            setAssessmentLoading(true);

            const formData = new FormData();
            formData.append("done_percentage", donePercentage);
            if (hesabat?.work_plan_serial_number) {
                formData.append("work_plan_serial_number", hesabat?.work_plan_serial_number);
            }
            if (assessmentScore !== null) {
                formData.append("assessment_score", assessmentScore.toString());
            }
            if (uploadedFile) {
                formData.append("activity_doc_path", uploadedFile);
            }

            const res = await submitHesabat(formData, token ? token : '');
            setAssessmentLoading(false);

            switch (res) {
                case "SUCCESS":
                    Swal.fire({
                        icon: "success",
                        title: "Hesabat təqdim edildi",
                        confirmButtonText: "OK"
                    });
                    break;
                case "NOT FOUND":
                    Swal.fire({
                        icon: "error",
                        title: "Məlumat tapılmadı",
                        confirmButtonText: "OK"
                    });
                    break;
                case "BAD REQUEST":
                    Swal.fire({
                        icon: "error",
                        title: "Bütün məlumatların təmin edildiyindən əmin olun",
                        confirmButtonText: "OK"
                    });
                    break;
                case "ERROR":
                    Swal.fire({
                        icon: "error",
                        title: "Xəta baş verdi",
                        confirmButtonText: "OK"
                    });
                    break;
                default:
                    Swal.fire({
                        icon: "error",
                        title: "Gözlənilməz xəta baş verdi",
                        confirmButtonText: "OK"
                    });
            }
        }
    };

    const handleDoneHesabat = async () => {
        setDoneLoading(true);

        try {
            const res = await doneHesabat(hesabat?.work_plan_serial_number ? hesabat?.work_plan_serial_number : "", token ? token : "");

            switch (res) {
                case "SUCCESS":
                    Swal.fire({
                        icon: "success",
                        title: "Hesabat təqdim edildi",
                        confirmButtonText: "OK"
                    });
                    break;
                case "NOT FOUND":
                    Swal.fire({
                        icon: "error",
                        title: "Təmin edilən məlumatların düzgünlüyündən əmin olun",
                        confirmButtonText: "OK"
                    });
                    break;
                case "BAD REQUEST":
                    Swal.fire({
                        icon: "error",
                        title: "Bütün məlumatların təmin edildiyindən əmin olun",
                        confirmButtonText: "OK"
                    });
                    break;
                case "ERROR":
                    Swal.fire({
                        icon: "error",
                        title: "Gözlənilməz xəta baş verdi",
                        confirmButtonText: "OK"
                    });
                    break;
                default:
                    Swal.fire({
                        icon: "error",
                        title: "Gözlənilməz xəta baş verdi",
                        confirmButtonText: "OK"
                    });
                    break;
            };
        } catch (e) {
            Swal.fire({
                icon: "error",
                title: "Gözlənilməz xəta baş verdi",
                confirmButtonText: "OK"
            });
        }
    };

    const handleUpdateAssessment = async () => {
        if (!hesabat?.work_plan_serial_number) {
            Swal.fire({
                icon: "error",
                title: "Uğursuz",
                text: "Hesabat məlumatı mövcud deyil."
            });
            return;
        }

        if (newAdminAssessment === null || isNaN(newAdminAssessment)) {
            Swal.fire({
                icon: "error",
                title: "Uğursuz",
                text: "Qiymət daxil edin."
            });
            return;
        }

        setAssessmentLoading(true);

        try {
            const res = await updateAssessment(
                {
                    work_plan_serial_number: hesabat?.work_plan_serial_number,
                    admin_assessment_score: newAdminAssessment
                },
                token ? token : ""
            );

            switch (res) {
                case "SUCCESS":
                    Swal.fire({
                        icon: "success",
                        title: "Uğurlu",
                        text: "Qiymət uğurla yeniləndi."
                    }).then(() => {
                        window.location.reload();
                    });
                    break;
                case "BAD REQUEST":
                    Swal.fire({
                        icon: "error",
                        title: "Uğursuz",
                        text: "Təyin edilən qiymət düzgün deyil."
                    });
                    break;
                case "ERROR":
                default:
                    Swal.fire({
                        icon: "error",
                        title: "Xəta",
                        text: "Gözlənilməz xəta baş verdi."
                    });
                    break;
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Xəta",
                text: "Gözlənilməz xəta baş verdi."
            });
        } finally {
            setAssessmentLoading(false);
        }
    };
    const handleAddAssessment = async () => {
        setAssessmentLoading(true);
        if (!hesabat?.work_plan_serial_number) {
            Swal.fire({ icon: "error", title: "Uğursuz", text: "Hesabat məlumatı mövcud deyil." });
            return;
        }
        if (adminAsessment === null || isNaN(adminAsessment)) {
            Swal.fire({ icon: "error", title: "Uğursuz", text: "Qiymət daxil edin." });
            return;
        }

        try {
            const res = await addAssessment({
                work_plan_serial_number: hesabat?.work_plan_serial_number,
                admin_assessment_score: Number(adminAsessment)
            }, token ? token : '');

            switch (res) {
                case "BAD REQUEST":
                    Swal.fire({
                        icon: "error",
                        title: "Uğursuz",
                        text: "Təyin edilən qiymət mənfi ola bilməz.",
                    });
                    break;
                case "CONFLICT":
                    Swal.fire({
                        icon: "error",
                        title: "Uğursuz",
                        text: "Hesabata qiymət edilməsi üçün ilkin olaraq hesabat icraçı tərəfindən təhvil verilməlidir.",
                    });
                    break;
                case "SUCCESS":
                    Swal.fire({
                        icon: "success",
                        title: "Uğurlu",
                        text: "Uğurla qiymət təyin edildi.",
                    }).then(() => {
                        setAssessmentLoading(false);
                        window.location.reload();
                    })
                    break;
                case "ERROR":
                    Swal.fire({
                        icon: "error",
                        title: "Uğursuz",
                        text: "Gözlənilməz xəta bir müddət sonra yenidən cəhd edin.",
                    });
                    break;
                default:
                    Swal.fire({
                        icon: "error",
                        title: "Uğursuz",
                        text: "Gözlənilməz xəta bir müddət sonra yenidən cəhd edin.",
                    });
                    break;
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Uğursuz",
                text: "Gözlənilməz xəta bir müddət sonra yenidən cəhd edin.",
            });
        }
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
                                    value={hesabat?.fin_kod ?? ""}
                                    disabled
                                    readOnly
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
                                    <Input type="text" id="input" placeholder="Fəaliyyət növü" value={activityTypeName?.toString() ?? ""} onChange={(e) => { setActivityTypeName(e.target.value) }} />
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
                                        <p className="mr-[20px] text-gray-800 dark:text-gray-200">{docName}</p>
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
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-[5px] bg-blue-600 dark:bg-blue-400 cursor-pointer"
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
                                <Input
                                    type="text"
                                    value={donePercentage ?? ""}
                                    placeholder={donePercentage ? undefined : "Qiymətləndirmə seçin"}
                                    disabled={donePercentage ? true : false}
                                    readOnly
                                />
                            </div>

                            <div className="w-full">
                                <Label>Keyfiyyətin idarəolunması şöbəsinin qiyməti (0 - 100)</Label>
                                <div className="relative w-full">
                                    {!updatableAssessment ? (
                                        <Input
                                            type="number"
                                            min={0}
                                            max={100}
                                            value={hesabat?.admin_assessment ?? ""}
                                            placeholder={hesabat?.admin_assessment ? undefined : "Təyin edilməyib"}
                                            disabled={role !== 1}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === "") {
                                                    setAdminAssessment(null);
                                                } else {
                                                    let num = Number(val);
                                                    if (num < 0) num = 0;
                                                    if (num > 100) num = 100;
                                                    setAdminAssessment(num);
                                                }
                                            }}
                                            className="w-full pr-12"
                                        />
                                    ) : (
                                        <Input
                                            type="number"
                                            min={0}
                                            max={100}
                                            value={newAdminAssessment ?? ""}
                                            placeholder={newAdminAssessment !== null ? String(newAdminAssessment) : "Yeni qiymət təyin edin"}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === "") {
                                                    setNewAdminAssessment(null);
                                                } else {
                                                    let num = Number(val);
                                                    if (num < 0) num = 0;
                                                    if (num > 100) num = 100;
                                                    setNewAdminAssessment(num);
                                                }
                                            }}
                                        />
                                    )}
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        {!updatableAssessment ? (
                                            <div className="inline-flex items-center justify-center w-8 h-8 rounded-[5px] bg-blue-600 dark:bg-blue-400 cursor-pointer text-white" onClick={() => setUpdatableAssessment(true)}>
                                                <EditIcon />
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center justify-center w-8 h-8 rounded-[5px] bg-green-600 dark:bg-green-400 cursor-pointer text-white"
                                            onClick={handleUpdateAssessment}>
                                                <DoneIcon />
                                            </div>
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <Label>Süni intellekt qiymətləndirməsi</Label>
                                <Input
                                    type="text"
                                    value={hesabat?.ai_assessment ?? ""}    
                                    placeholder={hesabat?.ai_assessment ? undefined : "Təyin edilməyib"}
                                    disabled
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    {role !== 1 ? (
                        <div className="flex justify-center items-center mt-[30px]">
                            <Button disabled={loading || submitted}>
                                {loading ? "Yüklənir..." : "Təsdiq et"}
                            </Button>
                        </div>
                    ) : null}
                </div>
            </form>
            {role === 1 ? (
                <div className="flex justify-center items-center mt-[30px]">
                    <button className={` mr-[20px] inline-flex items-center justify-center gap-2 rounded-lg transition bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 px-5 py-2`} disabled={assessmentLoading} onClick={handleAddAssessment}>
                        {assessmentLoading ? "Yüklənir..." : "Təsdiq et"}
                    </button>
                    <button className={`inline-flex items-center justify-center gap-2 rounded-lg transition bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 px-5 py-2`} disabled={doneLoading} onClick={handleDoneHesabat}>
                        {doneLoading     ? "Yüklənir..." : "Hesabatı bitir"}
                    </button>
                </div>
            ) : null}
        </div>
    )
}
