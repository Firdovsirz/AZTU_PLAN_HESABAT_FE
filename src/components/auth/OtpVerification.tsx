import Swal from "sweetalert2";
import Label from "../form/Label";
import { Link } from "react-router";
import { useParams } from "react-router";
import { useState, useRef } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import { useNavigate } from "react-router-dom";
import { validateOTP } from "../../services/otp/otp";

export default function OtpVerification() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const { finKod } = useParams();
    // const [token, setToken] = useState("");


    const handleOtpValidation = async () => {
    try {
        setLoading(true);
        const token = finKod ? await validateOTP(finKod, Number(otp.join(""))) : null;

        if (token && token !== "ERROR" && token !== "UNAUTHORIZED") {
            navigate(`/reset-password/${token}`);
        } else if (token === "UNAUTHORIZED") {
            Swal.fire("OTP yanlışdır və ya vaxtı bitmişdir.", "", "error");
        } else {
            Swal.fire("Xəta baş verdi", "", "error");
        }
    } catch (err) {
        console.error(err);
        Swal.fire("Xəta baş verdi", "", "error");
    } finally {
        setLoading(false);
    }
};

    const inputRefs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            OTP təsdiqləmə
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Şifrənizi dəyişmək üçün e-poçt adresinə göndərilən 1 dəfəlik 6 rəqəmdən ibarət kodu (OTP) daxil edin!
                        </p>
                    </div>
                    <div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const finKod = otp.join("");
                                if (finKod.length !== 6 || otp.some(d => d === "")) {
                                    Swal.fire("OTP 6 rəqəm olmalıdır!", "", "warning");
                                    return;
                                }
                                handleOtpValidation();
                                console.log(otp.join(""));
                            }}
                        >
                            <div className="space-y-6">
                                <div>
                                    <Label>
                                        OTP Kodu <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <div className="flex gap-2 items-center">
                                        {otp.map((digit, index) => (
                                            <div key={index} className="flex items-center">
                                                <Input
                                                    ref={inputRefs[index]}
                                                    type="text"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, "");
                                                        const newOtp = [...otp];
                                                        newOtp[index] = value;
                                                        setOtp(newOtp);
                                                        if (value && index < inputRefs.length - 1) {
                                                            inputRefs[index + 1].current?.focus();
                                                        }
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Backspace" && !otp[index] && index > 0) {
                                                            inputRefs[index - 1].current?.focus();
                                                        }
                                                    }}
                                                    className="text-center w-8"
                                                    placeholder="-"
                                                />
                                                {index === 2 && (
                                                    <span className="ml-2 text-lg text-gray-500 select-none">-</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <Button
                                        className="w-full"
                                        size="sm"
                                        disabled={loading || otp.join("").length !== 6}
                                    >
                                        {loading ? "Doğrulanır..." : "Daxil ol"}
                                    </Button>
                                </div>
                            </div>
                        </form>

                        <div className="mt-5">
                            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                                Hesabınız yoxdur? {""}
                                <Link
                                    to="/signup"
                                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                >
                                    Qeydiyyat
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
