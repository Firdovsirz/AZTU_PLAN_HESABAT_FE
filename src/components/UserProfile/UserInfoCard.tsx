import Swal from "sweetalert2";
import Label from "../form/Label";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Input from "../form/input/InputField";
import { RootState } from "../../redux/store";
import Skeleton from "@mui/material/Skeleton";
import { useModal } from "../../hooks/useModal";
import { getDutyByCode } from "../../services/duty/duty";
import { getFacName } from "../../services/faculty/facultyService";
import { getCafDetails, CafedraDetailsInterface } from "../../services/cafedra/cafedraService";
import { getUserByFinKod, updateUser, User, UpdateUser, ResponseStatus } from "../../services/user/user";

export default function UserInfoCard() {
  const [user, setUser] = useState<User>();
  const [dutyName, setDutyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [facultyName, setFacultyName] = useState("");
  const { isOpen, openModal, closeModal } = useModal();
  const token = useSelector((state: RootState) => state.auth.token);
  const finKod = useSelector((state: RootState) => state.auth.fin_kod);
  const [cafedraDetails, setCafedraDetails] = useState<CafedraDetailsInterface[]>([]);

  const [modalName, setModalName] = useState("");
  const [modalSurname, setModalSurname] = useState("");
  const [modalFatherName, setModalFatherName] = useState("");
  const [modalDuty, setModalDuty] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!finKod) return;

    setLoading(true);

    // Sequential fetching: first get user, then dependent calls
    getUserByFinKod(finKod, token ?? "")
      .then((fetchedUser) => {
        setUser(fetchedUser);
        if (!fetchedUser) {
          setDutyName("");
          setFacultyName("");
          setCafedraDetails([]);
          return;
        }
        return Promise.all([
          getDutyByCode(fetchedUser.duty_code ?? 0, token ?? "").then(setDutyName),
          getFacName(fetchedUser.faculty_code ?? "", token ?? "").then(setFacultyName),
          getCafDetails(fetchedUser.cafedra_code ?? "", token ?? "").then((res) => {
            if (Array.isArray(res)) {
              setCafedraDetails(res);
            } else {
              console.error("Unexpected response:", res);
              setCafedraDetails([]);
            }
          }),
        ]);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [finKod, token]);

  const openEditModal = () => {
    if (user) {
      setModalName(user.name ?? "");
      setModalSurname(user.surname ?? "");
      setModalFatherName(user.father_name ?? "");
      setModalDuty(user.duty_code ?? null);
    }
    openModal();
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    const updatedUser: UpdateUser = {
      fin_kod: user.fin_kod,
      name: modalName,
      surname: modalSurname,
      father_name: modalFatherName,
      duty_code: modalDuty
    };
    let result: ResponseStatus | undefined;
    try {
      if (token) {
        result = await updateUser(updatedUser, token);
      }
    } catch (error) {
      result = undefined;
    } finally {
      setIsSaving(false);
    }
    closeModal();
    if (result === ResponseStatus.SUCCESS) {
      setUser({
        ...user,
        name: modalName,
        surname: modalSurname,
        father_name: modalFatherName,
      });
      await Swal.fire({
        icon: "success",
        title: "Uğurlu!",
        text: "İstifadəçi məlumatları yeniləndi.",
      });
    } else if (result === ResponseStatus.NOT_FOUND) {
      await Swal.fire({
        icon: "error",
        title: "Xəta!",
        text: "İstifadəçi tapılmadı.",
      });
    } else {
      await Swal.fire({
        icon: "error",
        title: "Xəta!",
        text: "Məlumatları yeniləmək mümkün olmadı.",
      });
    }
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Şəxsi məlumatlar
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Ad
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {loading ? <Skeleton variant="text" width={150} height={30} /> : user?.name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Soyad
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {loading ? <Skeleton variant="text" width={150} height={30} /> : user?.surname}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Ata adı
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {loading ? <Skeleton variant="text" width={150} height={30} /> : user?.father_name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                E-poçt adresi
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {loading ? <Skeleton variant="text" width={150} height={30} /> : user?.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Vəzifə
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {loading ? (
                  <Skeleton variant="text" width={150} height={30} />
                ) : dutyName ? (
                  <>
                    {dutyName}
                  </>
                ) : (
                  <div className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block">
                    Məlumat yoxdur
                  </div>
                )}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Fakültə
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {loading ? (
                  <Skeleton variant="text" width={150} height={30} />
                ) : facultyName ? (
                  <>
                    {facultyName}
                  </>
                ) : (
                  <div className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block">
                    Məlumat yoxdur
                  </div>
                )}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Kafedra
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {loading ? (
                  <Skeleton variant="text" width={150} height={30} />
                ) : cafedraDetails[0] ? (
                  <>
                    {cafedraDetails[0].cafedra_name}
                  </>
                ) : (
                  <div className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block">
                    Məlumat yoxdur
                  </div>
                )}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Qeydiyyat tarixi
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {loading ? (
                  <Skeleton variant="text" width={150} height={30} />
                ) : user?.created_at ? (
                  <>
                    {(() => {
                      const createdDate = new Date(user.created_at);
                      const today = new Date();
                      const yesterday = new Date();
                      yesterday.setDate(today.getDate() - 1);

                      const isSameDay = (d1: Date, d2: Date) =>
                        d1.getFullYear() === d2.getFullYear() &&
                        d1.getMonth() === d2.getMonth() &&
                        d1.getDate() === d2.getDate();

                      if (isSameDay(createdDate, today)) return "Bu gün";
                      if (isSameDay(createdDate, yesterday)) return "Dünən";
                      return createdDate.toLocaleDateString("en-GB");
                    })()}
                  </>
                ) : (
                  <div className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block">
                    Məlumat yoxdur
                  </div>
                )}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openEditModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Düzəliş et
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Şəxsi məlumatlarınızda düzəliş edin
            </h4>
          </div>
          <form className="flex flex-col" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Şəxsi məlumatlar
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Ad</Label>
                    <Input
                      type="text"
                      value={modalName}
                      onChange={(e) => setModalName(e.target.value)}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Soyad</Label>
                    <Input
                      type="text"
                      value={modalSurname}
                      onChange={(e) => setModalSurname(e.target.value)}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Ata adı</Label>
                    <Input
                      type="text"
                      value={modalFatherName}
                      onChange={(e) => setModalFatherName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Bağla
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Yadda saxlanır..." : "Yadda saxla"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
