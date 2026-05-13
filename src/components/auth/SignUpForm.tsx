import Swal from "sweetalert2";
import Label from "../form/Label";
import Select from "../form/Select";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Input from "../form/input/InputField";
import { RootState } from "../../redux/store";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { signup } from "../../services/auth/authService";
import { getDuties, Duty, OrgType } from "../../services/duty/duty";
import React, { useState, useEffect, useMemo } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { getFaculties, Faculty } from "../../services/faculty/facultyService";
import { getCafedrasByFaculty, Cafedra } from "../../services/cafedra/cafedraService";
import { getDepartments, Department } from "../../services/department/departmentService";

type FormSection = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

const Section: React.FC<FormSection> = ({ title, description, children }) => (
  <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 p-5">
    <div className="mb-4">
      <h3 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white">{title}</h3>
      {description && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p>
      )}
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

export default function SignUpForm() {
  const navigate = useNavigate();
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [inputFocussed, setInputFocussed] = useState(false);
  const [showRepPassword, setShowRepPassword] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);

  const [orgType, setOrgType] = useState<OrgType>("faculty");

  // Form data
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [finKod, setFinKod] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [duty, setDuty] = useState("");
  const [faculty, setFaculty] = useState("");
  const [cafedra, setCafedra] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");

  // Data sources
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [duties, setDuties] = useState<Duty[]>([]);
  const [cafedras, setCafedras] = useState<Cafedra[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    Promise.all([
      getFaculties(token).then((res) => setFaculties(Array.isArray(res) ? res : [])),
      getDepartments(token).then((res) => setDepartments(Array.isArray(res) ? res : [])),
    ]).finally(() => setInitialLoading(false));
  }, []);

  // Reload duties whenever orgType changes; reset dependent fields
  useEffect(() => {
    setDuty("");
    setRole("");
    setCafedra("");
    if (orgType === "faculty") {
      setDepartment("");
    } else {
      setFaculty("");
    }
    setDuties([]);
    getDuties(token, orgType).then((res) => {
      setDuties(Array.isArray(res) ? res : []);
    });
  }, [orgType]);

  useEffect(() => {
    if (orgType !== "faculty" || !faculty) {
      setCafedras([]);
      return;
    }
    getCafedrasByFaculty(faculty, token || '')
      .then((res) => {
        if (!res || res === "NOT FOUND" || !res.cafedras) setCafedras([]);
        else setCafedras(res.cafedras);
      })
      .catch(() => setCafedras([]));
  }, [faculty, orgType]);

  const facultyOptions = useMemo(
    () => faculties.map((f) => ({ value: String(f.faculty_code), label: `${f.faculty_name} (${f.faculty_code})` })),
    [faculties]
  );
  const departmentOptions = useMemo(
    () => departments.map((d) => ({ value: d.department_code, label: `${d.department_name} (${d.department_code})` })),
    [departments]
  );
  const dutyOptions = useMemo(
    () => duties.map((d) => ({ value: String(d.duty_code), label: `${d.duty_name} (${d.duty_code})` })),
    [duties]
  );
  const cafedraOptions = useMemo(
    () => (cafedras || []).map((c) => ({ value: String(c.cafedra_code), label: `${c.cafedra_name} (${c.cafedra_code})` })),
    [cafedras]
  );

  const handleDutyChange = (value: string) => {
    setDuty(value);
    if (orgType === "department") {
      setRole("4");
      return;
    }
    switch (value) {
      case "1":
      case "2":
      case "3":
        setRole("2");
        break;
      case "4":
        setRole("3");
        break;
      case "5":
      case "6":
      case "7":
      case "8":
        setRole("4");
        break;
      default:
        setRole("");
        break;
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const strongPw =
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password) &&
        password.length >= 8;

      if (!strongPw) {
        Swal.fire("Xəta", "Daha güclü bir şifrədən istifadə edin!", "error");
        return;
      }
      if (password !== repeatedPassword) {
        Swal.fire("Xəta", "Şifrələr uyğun deyil!", "error");
        return;
      }

      const formData = new FormData();
      formData.append("fin_kod", finKod);
      formData.append("name", name);
      formData.append("surname", surname);
      formData.append("father_name", fatherName);
      formData.append("duty_code", duty);
      formData.append("password", password);
      formData.append("role", role);
      formData.append("email", email);

      if (orgType === "faculty") {
        formData.append("faculty_code", faculty);
        if (cafedra) formData.append("cafedra_code", cafedra);
      } else {
        formData.append("department_code", department);
      }

      const res = await signup(formData);

      if (res === "SUCCESS") {
        Swal.fire({
          icon: "success",
          title: "Qeydiyyat uğurla tamamlandı!",
          text: "Hesabınız təsdiq edildikdə e-poçt vasitəsilə sizə bildiriş göndəriləcək.",
          confirmButtonText: "OK"
        }).then(() => navigate("/signin"));
      } else if (res === "CONFLICT") {
        Swal.fire({ icon: "error", title: "Xəta", confirmButtonText: "OK" });
      } else {
        Swal.fire({ icon: "error", title: "İstifadəçi artıq mövcuddur", confirmButtonText: "OK" });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Xəta baş verdi", confirmButtonText: "OK" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    name.trim() !== "" &&
    surname.trim() !== "" &&
    fatherName.trim() !== "" &&
    finKod.trim().length <= 7 &&
    finKod.trim().length > 0 &&
    password.trim() !== "" &&
    repeatedPassword.trim() !== "" &&
    duty.trim() !== "" &&
    role.trim() !== "" &&
    email.trim() !== "" &&
    (
      (orgType === "faculty" && faculty.trim() !== "" && (+duty <= 3 || cafedra.trim() !== "")) ||
      (orgType === "department" && department.trim() !== "")
    );

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="mb-2 font-semibold text-gray-900 text-title-sm dark:text-white sm:text-title-md">
            Qeydiyyat
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Qeydiyyat üçün aşağıdakı xanaları doldurun
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-5">
          <div>
            <Label>Qeydiyyat növü<span className="text-error-500">*</span></Label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <button
                type="button"
                onClick={() => setOrgType("faculty")}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                  orgType === "faculty"
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                    : "border-gray-200 dark:border-gray-800 hover:border-gray-300"
                }`}
              >
                <SchoolIcon className={orgType === "faculty" ? "text-brand-600" : "text-gray-500"} />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Fakültə</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Fakültə və kafedraya bağlı</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setOrgType("department")}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                  orgType === "department"
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                    : "border-gray-200 dark:border-gray-800 hover:border-gray-300"
                }`}
              >
                <BusinessIcon className={orgType === "department" ? "text-brand-600" : "text-gray-500"} />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Şöbə</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Şöbəyə bağlı</p>
                </div>
              </button>
            </div>
          </div>

          <Section title="Şəxsi məlumatlar">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <Label>Ad<span className="text-error-500">*</span></Label>
                <Input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ad" />
              </div>
              <div>
                <Label>Soyad<span className="text-error-500">*</span></Label>
                <Input type="text" id="lname" name="lname" value={surname} onChange={(e) => setSurname(e.target.value)} placeholder="Soyad" />
              </div>
              <div>
                <Label>Ata adı<span className="text-error-500">*</span></Label>
                <Input type="text" id="fname" name="fname" value={fatherName} onChange={(e) => setFatherName(e.target.value)} placeholder="Ata adı" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label>Fin Kod<span className="text-error-500">*</span></Label>
                <Input type="text" id="finKod" maxLength={7} name="finKod" value={finKod} onChange={(e) => setFinKod(e.target.value.toUpperCase())} placeholder="Fin Kod" />
              </div>
              <div>
                <Label>E-poçt<span className="text-error-500">*</span></Label>
                <Input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-poçt" />
              </div>
            </div>
          </Section>

          <Section
            title={orgType === "faculty" ? "Fakültə məlumatları" : "Şöbə məlumatları"}
            description={orgType === "faculty"
              ? "Fakültə və müvafiq vəzifə seçin"
              : "Şöbə və müvafiq vəzifə seçin"}
          >
            {initialLoading ? (
              <div className="flex justify-center items-center py-6">
                <CircularProgress size={24} />
              </div>
            ) : orgType === "faculty" ? (
              <>
                <div>
                  <Label>Fakültə<span className="text-error-500">*</span></Label>
                  <Select key={`fac-${orgType}`} options={facultyOptions} placeholder="Fakültə seçin" onChange={setFaculty} className="dark:bg-dark-900" />
                </div>
                <div>
                  <Label>Vəzifə<span className="text-error-500">*</span></Label>
                  <Select key={`duty-${orgType}`} options={dutyOptions} placeholder="Vəzifə seçin" onChange={handleDutyChange} className="dark:bg-dark-900" />
                </div>
                {+duty > 3 && (
                  <div>
                    <Label>Kafedra<span className="text-error-500">*</span></Label>
                    <Select key={`caf-${faculty}`} options={cafedraOptions} placeholder="Kafedra seçin" onChange={setCafedra} className="dark:bg-dark-900" />
                  </div>
                )}
              </>
            ) : (
              <>
                <div>
                  <Label>Şöbə<span className="text-error-500">*</span></Label>
                  <Select key={`dep-${orgType}`} options={departmentOptions} placeholder="Şöbə seçin" onChange={setDepartment} className="dark:bg-dark-900" />
                </div>
                <div>
                  <Label>Vəzifə<span className="text-error-500">*</span></Label>
                  <Select key={`duty-${orgType}`} options={dutyOptions} placeholder="Vəzifə seçin" onChange={handleDutyChange} className="dark:bg-dark-900" />
                </div>
              </>
            )}
          </Section>

          <Section title="Şifrə" description="Şifrəniz ən azı 8 simvol, bir böyük hərf, bir rəqəm və bir xüsusi simvoldan ibarət olmalıdır.">
            <div>
              <Label>Şifrə<span className="text-error-500">*</span></Label>
              <div className="relative">
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifrə"
                  type={showPassword ? "text" : "password"}
                  onFocus={() => setInputFocussed(true)}
                  onBlur={() => setInputFocussed(false)}
                />
                <span onClick={() => setShowPassword(!showPassword)} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                  {showPassword ? <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" /> : <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />}
                </span>
              </div>
            </div>
            {inputFocussed && (
              <div className="grid grid-cols-2 gap-2">
                {[
                  { ok: password.length >= 8, label: "Minimum 8 simvol" },
                  { ok: /[A-Z]/.test(password), label: "Ən azı bir böyük hərf" },
                  { ok: /[0-9]/.test(password), label: "Ən azı bir rəqəm" },
                  { ok: /[^A-Za-z0-9]/.test(password), label: "Ən azı bir xüsusi simvol" }
                ].map((rule, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                    <div
                      style={{
                        backgroundColor: rule.ok ? "green" : "red",
                        width: 16, height: 16, borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center"
                      }}
                    >
                      {rule.ok
                        ? <DoneIcon style={{ color: "white", fontSize: 12 }} />
                        : <CloseIcon style={{ color: "white", fontSize: 12 }} />}
                    </div>
                    <span>{rule.label}</span>
                  </div>
                ))}
              </div>
            )}
            <div>
              <Label>Təkrar Şifrə<span className="text-error-500">*</span></Label>
              <div className="relative">
                <Input value={repeatedPassword} onChange={(e) => setRepeatedPassword(e.target.value)} placeholder="Təkrar şifrə" type={showRepPassword ? "text" : "password"} />
                <span onClick={() => setShowRepPassword(!showRepPassword)} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                  {showRepPassword ? <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" /> : <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />}
                </span>
              </div>
            </div>
          </Section>

          <button
            type="submit"
            className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-60"
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? <CircularProgress size={20} style={{ color: "white" }} /> : "Qeydiyyat"}
          </button>
        </form>

        <p className="mt-5 text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
          Artıq hesabınız var?{" "}
          <Link to="/signin" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
            Daxil Ol
          </Link>
        </p>
      </div>
    </div>
  );
}
