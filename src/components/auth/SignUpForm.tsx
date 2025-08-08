import Swal from "sweetalert2";
import Label from "../form/Label";
import Select from "../form/Select";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import Input from "../form/input/InputField";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { signup } from "../../services/auth/authService";
import { getDuties, Duty } from "../../services/duty/duty";
import React, { useState, useEffect, useMemo } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { getFaculties, Faculty } from "../../services/faculty/facultyService";
import { getCafedrasByFaculty, Cafedra } from "../../services/cafedra/cafedraService";

export default function SignUpForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showRepPassword, setShowRepPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputFocussed, setInputFocussed] = useState(false);

  // Form Data

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [finKod, setFinKod] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [duty, setDuty] = useState("");
  const [faculty, setFaculty] = useState("");
  const [cafedra, setCafedra] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");

  // Faculty Service

  const [faculties, setFaculties] = useState<Faculty[]>([]);

  useEffect(() => {
    getFaculties()
      .then(setFaculties)
      .finally(() => {
        setLoading(false);
      })
  }, []);

  const facultyOptions = useMemo(() => {
    const options = faculties.map((faculty) => ({
      value: String(faculty.faculty_code),
      label: `${faculty.faculty_name} (${faculty.faculty_code})`
    }));
    return options;
  }, [faculties]);

  const handleFacultyChange = (value: string) => {
    setFaculty(value);
  };

  // Duty Service

  const [duties, setDuties] = useState<Duty[]>([]);

  useEffect(() => {
    getDuties()
      .then(setDuties)
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const dutyOptions = useMemo(() => {
    const options = duties.map((duty) => ({
      value: String(duty.duty_code),
      label: `${duty.duty_name} (${duty.duty_code})`
    }));
    return options;
  }, [duties]);

  const handleDutyChange = (value: string) => {
    setDuty(value);
    console.log(value);

    switch (value) {
      case "1":
        setRole("2");
        break;
      case "2":
        setRole("2");
        break;
      case "3":
        setRole("2");
        break;
        break;
      case "4":
        setRole("3");
        break;
      case "5":
        setRole("4");
        break;
      case "6":
        setRole("4");
        break;
      case "7":
        setRole("4");
        break;
      case "8":
        setRole("4");
        break;
      default:
        break;
    }
  };

  // Cafedra Service

  const [cafedras, setCafedras] = useState<Cafedra[]>([]);

  useEffect(() => {
    getCafedrasByFaculty(faculty)
      .then((res) => {
        if (res === "NOT FOUND") {
          setCafedras([]);
        } else {
          setCafedras(res.cafedras);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [faculty]);

  const cafedraOptions = useMemo(() => {
    const options = cafedras.map((cafedra) => ({
      value: String(cafedra.cafedra_code),
      label: `${cafedra.cafedra_name} (${cafedra.cafedra_code})`
    }));
    return options;
  }, [cafedras]);

  const handleCafedraChange = (value: string) => {
    setCafedra(value);
  };

  // Signup Service

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!(/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) && password.length >= 8) {
        Swal.fire("Xəta", "Daha güclü bir şifrədən istifadə edin!", "error");
      } else if (password !== repeatedPassword) {
        Swal.fire("Xəta", "Şifrələr uyğun deyil!", "error");
      } else {
        const formData = new FormData();
        formData.append("fin_kod", finKod);
        formData.append("name", name);
        formData.append("surname", surname);
        formData.append("father_name", fatherName);
        formData.append("faculty_code", faculty);
        formData.append("duty_code", duty);
        formData.append("password", password);
        formData.append("role", role);
        formData.append("email", email);

        if (cafedra) {
          formData.append("cafedra_code", cafedra);
        }

        const res = await signup(formData);

        if (res === "SUCCESS") {
          Swal.fire({
            icon: "success",
            title: "Qeydiyyat uğurla tamamlandı!",
            text: "Hesabınız təsdiq edildikdə e-poçt vasitəsilə sizə bildiriş göndəriləcək.",
            confirmButtonText: "OK"
          }).then(() => {
            navigate("/");
          });
        } else if (res === "CONFLICT") {
          Swal.fire({
            icon: "error",
            title: "Xəta",
            confirmButtonText: "OK"
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "İstifadəçi artıq mövcuddur",
            confirmButtonText: "OK"
          });
        }
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Xəta baş verdi",
        confirmButtonText: "OK"
      })
    } finally {
      setIsSubmitting(false);
    }
  }

  const isFormValid =
    name.trim() !== "" &&
    surname.trim() !== "" &&
    fatherName.trim() !== "" &&
    finKod.trim().length <= 7 &&
    password.trim() !== "" &&
    repeatedPassword.trim() !== "" &&
    duty.trim() !== "" &&
    faculty.trim() !== "" &&
    role.trim() !== "" &&
    email.trim() !== "" &&
    (+duty <= 3 || cafedra.trim() !== "");

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Qeydiyyat
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Qeydiyyat üçün aşağıkda xanaları doldurun!
            </p>
          </div>
          <div>
            <form onSubmit={handleSignUp}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {/* <!-- Ad Soyad Ata adı --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Ad<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => { setName(e.target.value) }}
                      placeholder="Ad"
                    />
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Soyad<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="lname"
                      name="lname"
                      value={surname}
                      onChange={(e) => { setSurname(e.target.value) }}
                      placeholder="Soyad"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Label>
                      Ata adı<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="fname"
                      name="fname"
                      value={fatherName}
                      onChange={(e) => { setFatherName(e.target.value) }}
                      placeholder="Ata adı"
                    />
                  </div>
                </div>
                {/* <!-- Fin Kod --> */}
                <div>
                  <Label>
                    Fin Kod<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="finKod"
                    maxLength={7}
                    name="finKod"
                    value={finKod}
                    onChange={(e) => { setFinKod(e.target.value.toUpperCase()) }}
                    placeholder="Fin Kod"
                  />
                </div>
                <div>
                  <Label>
                    E-poçt<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value) }}
                    placeholder="Fin Kod"
                  />
                </div>
                <div>
                  <Label>Fakültə</Label>
                  {loading ? (
                    <div className="flex justify-center items-center w-full h-full py-10">
                      <CircularProgress />
                    </div>
                  ) : (
                    <Select
                      options={facultyOptions}
                      placeholder={"Fakültə seçin"}
                      onChange={handleFacultyChange}
                      className="dark:bg-dark-900"
                    />
                  )}
                </div>
                <div>
                  <Label>Vəzifə</Label>
                  {loading ? (
                    <div className="flex justify-center items-center w-full h-full py-10">
                      <CircularProgress />
                    </div>
                  ) : (
                    <Select
                      options={dutyOptions}
                      placeholder={"Vəzifə seçin"}
                      onChange={handleDutyChange}
                      className="dark:bg-dark-900"
                    />
                  )}
                </div>
                {+duty > 3 ? (
                  <div>
                    <Label>Kafedra</Label>
                    {loading ? (
                      <div className="flex justify-center items-center w-full h-full py-10">
                        <CircularProgress />
                      </div>
                    ) : (
                      <Select
                        options={cafedraOptions}
                        placeholder={"Kafedra seçin"}
                        onChange={handleCafedraChange}
                        className="dark:bg-dark-900"
                      />
                    )}
                  </div>
                ) : null}
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Şifrə<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative mb-[20px]">
                    <Input
                      value={password}
                      onChange={(e) => { setPassword(e.target.value) }}
                      placeholder="Şifrə"
                      type={showPassword ? "text" : "password"}
                      onFocus={() => setInputFocussed(true)}
                      onBlur={() => setInputFocussed(false)}
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
                  {inputFocussed ? (
                    <div className="mb-[10px]">
                      <div className="flex items-center">
                        <div className="flex justify-center items-center"
                          style={{
                            backgroundColor: password.length >= 8 ? "green" : "red",
                            borderColor: password.length >= 8 ? "green" : "red",
                            borderWidth: 2,
                            width: "15px",
                            height: "15px",
                            borderRadius: "50%",
                            padding: "7px",
                            marginRight: 10
                          }}>
                          {password.length >= 8 ? (
                            <DoneIcon className="text-white" style={{ fontSize: "14px" }} />
                          ) : (
                            <CloseIcon className="text-white" style={{ fontSize: "14px" }} />
                          )}
                        </div>
                        <p>
                          Minimum 8 simvol
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div className="flex justify-center items-center"
                          style={{
                            backgroundColor: /[A-Z]/.test(password) ? "green" : "red",
                            borderColor: /[A-Z]/.test(password) ? "green" : "red",
                            borderWidth: 2,
                            width: "15px",
                            height: "15px",
                            borderRadius: "50%",
                            padding: "7px",
                            marginRight: 10
                          }}>
                          {/[A-Z]/.test(password) ? (
                            <DoneIcon className="text-white" style={{ fontSize: "14px" }} />
                          ) : (
                            <CloseIcon className="text-white" style={{ fontSize: "14px" }} />
                          )}
                        </div>
                        <p>
                          Ən azı bir böyük hərf
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div className="flex justify-center items-center"
                          style={{
                            backgroundColor: /[0-9]/.test(password) ? "green" : "red",
                            borderColor: /[0-9]/.test(password) ? "green" : "red",
                            borderWidth: 2,
                            width: "15px",
                            height: "15px",
                            borderRadius: "50%",
                            padding: "7px",
                            marginRight: 10
                          }}>
                          {/[0-9]/.test(password) ? (
                            <DoneIcon className="text-white" style={{ fontSize: "14px" }} />
                          ) : (
                            <CloseIcon className="text-white" style={{ fontSize: "14px" }} />
                          )}
                        </div>
                        <p>
                          Ən azı bir nömrə
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div className="flex justify-center items-center"
                          style={{
                            backgroundColor: /[^A-Za-z0-9]/.test(password) ? "green" : "red",
                            borderColor: /[^A-Za-z0-9]/.test(password) ? "green" : "red",
                            borderWidth: 2,
                            width: "15px",
                            height: "15px",
                            borderRadius: "50%",
                            padding: "7px",
                            marginRight: 10
                          }}>
                          {/[^A-Za-z0-9]/.test(password) ? (
                            <DoneIcon className="text-white" style={{ fontSize: "14px" }} />
                          ) : (
                            <CloseIcon className="text-white" style={{ fontSize: "14px" }} />
                          )}
                        </div>
                        <p>
                          Ən azı bir xüsusi simvol (!@#$%^&*(),.?":{ }|")
                        </p>
                      </div>
                    </div>
                  ) : null}
                  <Label>
                    Təkrar Şifrə<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      value={repeatedPassword}
                      onChange={(e) => { setRepeatedPassword(e.target.value) }}
                      placeholder="Təkrar şifrə"
                      type={showRepPassword ? "text" : "password"}
                    />
                    <span
                      onClick={() => setShowRepPassword(!showRepPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showRepPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                {/* <!-- Button --> */}
                <div>
                  <button
                    type="submit"
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                    disabled={isSubmitting || !isFormValid}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={20} style={{ color: "white" }} />
                    ) : (
                      "Qeydiyyat"
                    )}
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Artıq hesabınız var? {""}
                <Link
                  to="/"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Daxil Ol
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}