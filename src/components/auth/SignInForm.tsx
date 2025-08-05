import Swal from "sweetalert2";
import { useState } from "react";
import Label from "../form/Label";
import { Link } from "react-router";
import Button from "../ui/button/Button";
import { useDispatch } from "react-redux";
import Input from "../form/input/InputField";
import { useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { loginSuccess } from "../../redux/slices/authSlice";
import { signin, Credentials } from "../../services/auth/authService";

export default function SignInForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [finKod, setFinKod] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const reqData: Credentials = {
      fin_kod: finKod,
      password: password,
    };

    setLoading(true);
    const response = await signin(reqData);
    setLoading(false);

    if (response === "UNAUTHORIZED") {
      Swal.fire({
        icon: "error",
        title: "Daxil olmaq mümkün olmadı",
        text: "İstifadəçi məlumatları yanlışdır.",
      });
    } else if (response === "error") {
      Swal.fire({
        icon: "error",
        title: "Xəta baş verdi",
        text: "Zəhmət olmasa bir az sonra yenidən cəhd edin.",
      });
    } else {
      dispatch(loginSuccess(response));
      navigate("/home");
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Daxil Ol
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sistemə daxil olmaq üçün fin kod və şifrənizi daxil edin!
            </p>
          </div>
          <div>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Fin Kod <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input maxLength={7} placeholder="A1A2A3A" value={finKod} onChange={(e) => { setFinKod(e.target.value.toUpperCase()) }} />
                </div>
                <div>
                  <Label>
                    Şifrə <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value) }}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Şifrəmi unutdum?
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm" disabled={loading || !finKod || !password}>
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
