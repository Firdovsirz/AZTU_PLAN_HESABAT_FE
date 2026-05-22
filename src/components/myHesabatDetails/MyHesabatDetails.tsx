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
    const [resultIndicator, setResultIndicator] = useState("");
    const role = useSelector((state: RootState) => state.auth.role);
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [assessmentLoading, setAssessmentLoading] = useState(false);
    const token = useSelector((state: RootState) => state.auth.token);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    useSelector((state: RootState) => state.auth.fin_kod);
    const [adminAssessment, setAdminAssessment] = useState<number | null>(null);
    const [assessmentScore, setAssessmentScore] = useState<number | null>(null);
    const [, setActivityTypeCodes] = useState<number | null>(null);
    const [, setActivityTypeNames] = useState<string | null>(null);
    const [updatableAssessment, setUpdatableAssessment] = useState<boolean>(false);
    const [newAdminAssessment, setNewAdminAssessment] = useState<number | null>(null);

    useEffect(() => {
        setLoading(true);
        getAssessments(token ? token : '')
            .then((res) => setAssessments(Array.isArray(res) ? res : []));
        // getActivities(finKod ? finKod : "", token ? token : '')
        //     .then(setActivities)
        //     .finally(() => {
        //         setLoading(false);
        //     });
    }, []);

    // const maxCode = activities.length > 0 ? Math.max(...activities.map((a) => a.actvity_type_code)) : 0;

    // const activityOptions = useMemo(() => {
    //     const options = activities.map((activity) => ({
    //         value: String(activity.actvity_type_code),
    //         label: activity.activity_type_name,
    //     }));
    //     const maxCode = activities.length > 0 ? Math.max(...activities.map((a) => a.actvity_type_code)) : 0;
    //     options.push({ value: String(maxCode + 1), label: "Digər" });
    //     return options;
    // }, [activities]);

    const assessmentOptions = useMemo(() => {
        return assessments.map((assessment) => ({
            value: String(assessment.assessment_score),
            label: `${assessment.score_name} (${assessment.assessment_score})`
        }));
    }, [assessments]);

    useEffect(() => {
        setLoading(true);
        getHesabatBySerialNumber(work_plan_serial_number, token ? token : '')
            .then((res) => {
                if (res && typeof res === "object") {
                    const h = res;
                    console.log(h);
                    setHesabat(h);
                    setDocName(h.doc_name);
                    setAssessmentScore(h.assessment_score);
                    setActivityTypeCodes(h.activity_type_codes);
                    setActivityTypeNames(h.activity_type_names);
                    setDonePercentage(h.done_percentage);
                    setDocPath(h.activity_doc_path);
                    setResultIndicator(h.result_indicator ?? "");
                    setSubmitted(h.submitted);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [work_plan_serial_number]);

    console.log(hesabat);

    // const handleActivityChange = (value: string) => {
    //     setActivityTypeCode(+value);
    // };

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
            <div className="space-y-6">
                <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 4 }} />
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <div key={i}>
                                <Skeleton variant="rectangular" height={14} width="40%" sx={{ borderRadius: 1, mb: 1.25 }} />
                                <Skeleton variant="rectangular" height={44} sx={{ borderRadius: 2 }} />
                            </div>
                        ))}
                    </div>
                    <div className="mt-7 flex justify-end gap-3">
                        <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 2 }} />
                        <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: 2 }} />
                    </div>
                </div>
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
            if (resultIndicator) {
                formData.append("result_indicator", resultIndicator);
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
                    }).then(() => {
                        setDoneLoading(false);
                    });
                    break;
                case "NOT FOUND":
                    Swal.fire({
                        icon: "error",
                        title: "Təmin edilən məlumatların düzgünlüyündən əmin olun",
                        confirmButtonText: "OK"
                    }).then(() => {
                        setDoneLoading(false);
                    });
                    break;
                case "BAD REQUEST":
                    Swal.fire({
                        icon: "error",
                        title: "Bütün məlumatların təmin edildiyindən əmin olun",
                        confirmButtonText: "OK"
                    }).then(() => {
                        setDoneLoading(false);
                    });
                    break;
                case "ERROR":
                    Swal.fire({
                        icon: "error",
                        title: "Gözlənilməz xəta baş verdi",
                        confirmButtonText: "OK"
                    }).then(() => {
                        setDoneLoading(false);
                    });
                    break;
                default:
                    Swal.fire({
                        icon: "error",
                        title: "Gözlənilməz xəta baş verdi",
                        confirmButtonText: "OK"
                    }).then(() => {
                        setDoneLoading(false);
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
        if (adminAssessment === null || isNaN(adminAssessment)) {
            Swal.fire({ icon: "error", title: "Uğursuz", text: "Qiymət daxil edin." });
            return;
        }

        try {
            const res = await addAssessment({
                work_plan_serial_number: hesabat?.work_plan_serial_number,
                admin_assessment_score: Number(adminAssessment)
            }, token ? token : '');

            switch (res) {
                case "BAD REQUEST":
                    Swal.fire({
                        icon: "error",
                        title: "Uğursuz",
                        text: "Təyin edilən qiymət mənfi ola bilməz.",
                    }).then(() => {
                        setAssessmentLoading(false);
                    });
                    break;
                case "CONFLICT":
                    Swal.fire({
                        icon: "error",
                        title: "Uğursuz",
                        text: "Hesabata qiymət edilməsi üçün ilkin olaraq hesabat icraçı tərəfindən təhvil verilməlidir.",
                    }).then(() => {
                        setAssessmentLoading(false);
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
                    }).then(() => {
                        setAssessmentLoading(false);
                    });
                    break;
                default:
                    Swal.fire({
                        icon: "error",
                        title: "Uğursuz",
                        text: "Gözlənilməz xəta bir müddət sonra yenidən cəhd edin.",
                    }).then(() => {
                        setAssessmentLoading(false);
                    });
                    break;
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Uğursuz",
                text: "Gözlənilməz xəta bir müddət sonra yenidən cəhd edin.",
            }).then(() => {
                setAssessmentLoading(false);
            });
        }
    };

    console.log(typeof hesabat?.activity_type_names);

    return (
        <div className="space-y-6">
            <section className="relative overflow-hidden rounded-3xl border border-white/30 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-6 sm:p-8 shadow-[0_30px_80px_-30px_rgba(70,95,255,0.55)]">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-20 -right-16 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -bottom-20 -left-10 h-60 w-60 rounded-full bg-blue-light-400/20 blur-3xl" />
                </div>
                <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur">
                            Hesabat #{hesabat?.work_plan_serial_number}
                        </span>
                        <h1 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                            Hesabat Detalları
                        </h1>
                        <p className="mt-2 max-w-xl text-sm text-white/80">
                            Hesabatınızı doldurun, sənəd əlavə edin və qiymətləndirmə üçün təqdim edin.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        {submitted && (
                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-400/15 px-3 py-1.5 text-xs font-semibold text-emerald-100 backdrop-blur">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.9)]" />
                                Təqdim edildi
                            </span>
                        )}
                        {hesabat?.assessment_score && (
                            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2 backdrop-blur">
                                <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/70">
                                    Qiymətləndirmə
                                </div>
                                <div className="mt-0.5 text-lg font-semibold text-white">
                                    {hesabat?.assessment_score}/5
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="mb-3 flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-200/60 dark:bg-brand-500/10 dark:text-brand-300 dark:ring-brand-500/20">
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M3 10h14M3 15h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                    </span>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Fəaliyyət növləri</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {(Array.isArray(hesabat?.activity_type_names) ? hesabat?.activity_type_names : []).map((activity, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-200 dark:bg-white/5 dark:text-gray-300 dark:ring-white/10"
                        >
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-[10px] font-semibold text-white">
                                {index + 1}
                            </span>
                            {activity}
                        </span>
                    ))}
                </div>
            </section>

            <form className="flex flex-col" onSubmit={handleSubmit}>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    <div className="mb-5 flex items-center gap-2">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-light-50 text-blue-light-600 ring-1 ring-inset ring-blue-light-200/60 dark:bg-blue-light-500/10 dark:text-blue-light-400 dark:ring-blue-light-500/20">
                            <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M4 4h12v12H4z M4 8h12 M8 4v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </span>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Hesabat məlumatları</h3>
                    </div>
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
                                <Label>İşin qısa təsviri</Label>
                                <Input
                                    type="text"
                                    value={hesabat?.work_desc ?? ""}
                                    disabled
                                    readOnly
                                />
                            </div>

                            <div className="lg:col-span-2">
                                <Label>Hədəf</Label>
                                <Input
                                    type="text"
                                    value={hesabat?.goal ?? ""}
                                    placeholder={hesabat?.goal ? undefined : "Təyin edilməyib"}
                                    disabled
                                    readOnly
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
                                    // disabled={assessmentScore ? true : false}
                                />
                            </div>

                            {/* {activityTypeCode === maxCode + 1 ? (
                                <div style={{
                                    width: "calc((100% / 2) - 10px)"
                                }}>
                                    <Label htmlFor="input">Fəaliyyət növü (Fəaliyyət növünüzü əsaslandırın)</Label>
                                    <Input type="text" id="input" placeholder="Fəaliyyət növü" value={activityTypeName?.toString() ?? ""} onChange={(e) => { setActivityTypeName(e.target.value) }} />
                                </div>
                            ) : null} */}

                            {docPath || docName ? (
                                <div className="lg:col-span-2">
                                    <Label>Yüklənən sənəd</Label>
                                    <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3 dark:border-gray-700/70 dark:bg-white/[0.02]">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-500/30">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z M14 2v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            </span>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{docName || "Sənəd"}</p>
                                                <p className="text-[11px] text-gray-500">Yüklənmiş hesabat sənədi</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/doc/${docPath}`}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-warning-50 text-warning-600 ring-1 ring-inset ring-warning-200/70 transition-all hover:bg-warning-100 hover:scale-105 active:scale-95 dark:bg-warning-500/10 dark:text-warning-400 dark:ring-warning-500/20"
                                                title="Baxış"
                                            >
                                                <VisibilityIcon sx={{ fontSize: 18 }} />
                                            </Link>
                                            <a
                                                href={`${docPath}`}
                                                download={docName}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/25 ring-1 ring-inset ring-brand-400/40 transition-all hover:from-brand-600 hover:to-brand-700 hover:scale-105 active:scale-95"
                                                title="Yüklə"
                                            >
                                                <DownloadIcon sx={{ fontSize: 18 }} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="lg:col-span-2">
                                    <Label>Fayl yükləyin (Hesabatınızı əsaslandırmaq üçün)</Label>
                                    <FileInput onChange={handleFileChange} />
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
                                            value={adminAssessment ?? hesabat?.admin_assessment ?? ""}
                                            placeholder={
                                                adminAssessment !== null
                                                    ? undefined
                                                    : (hesabat?.admin_assessment !== null ? String(hesabat?.admin_assessment) : "Təyin edilməyib")
                                            }
                                            disabled={role !== 1}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === "") setAdminAssessment(null);
                                                else {
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
                                    {role === 1 ? (
                                        <span className="absolute inset-y-0 right-1.5 flex items-center">
                                            {!updatableAssessment ? (
                                                <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-200/70 transition-all hover:bg-brand-100 hover:scale-105 active:scale-95 dark:bg-brand-500/10 dark:text-brand-400 dark:ring-brand-500/20" onClick={() => setUpdatableAssessment(true)}>
                                                    <EditIcon sx={{ fontSize: 16 }} />
                                                </button>
                                            ) : (
                                                <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-success-50 text-success-600 ring-1 ring-inset ring-success-200/70 transition-all hover:bg-success-100 hover:scale-105 active:scale-95 dark:bg-success-500/10 dark:text-success-400 dark:ring-success-500/20"
                                                    onClick={handleUpdateAssessment}>
                                                    <DoneIcon sx={{ fontSize: 16 }} />
                                                </button>
                                            )}
                                        </span>
                                    ) : null}
                                </div>
                            </div>

                            <div className="lg:col-span-2">
                                <Label>Nəticə indikatoru</Label>
                                <Input
                                    type="text"
                                    value={resultIndicator}
                                    placeholder="Nəticə indikatorunu daxil edin"
                                    onChange={(e) => setResultIndicator(e.target.value)}
                                    disabled={submitted}
                                    readOnly={submitted}
                                />
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
                        <div className="mt-7 flex items-center justify-end gap-3 border-t border-gray-100 pt-5 dark:border-gray-800">
                            <Button type="submit" disabled={loading || submitted}>
                                {loading ? "Yüklənir..." : submitted ? "Təqdim edildi" : "Təsdiq et"}
                            </Button>
                        </div>
                    ) : null}
                </div>
            </form>
            {role === 1 ? (
                <div className="sticky bottom-4 z-10 mx-auto flex max-w-fit items-center gap-3 rounded-2xl border border-gray-200 bg-white/90 p-2 shadow-2xl shadow-gray-900/10 backdrop-blur dark:border-gray-700 dark:bg-gray-900/90">
                    <Button variant="outline" size="sm" disabled={assessmentLoading} onClick={handleAddAssessment}>
                        {assessmentLoading ? "Yüklənir..." : "Qiymətləndirməni təsdiq et"}
                    </Button>
                    <Button size="sm" disabled={doneLoading} onClick={handleDoneHesabat}>
                        {doneLoading ? "Yüklənir..." : "Hesabatı bitir"}
                    </Button>
                </div>
            ) : null}
        </div>
    )
}
