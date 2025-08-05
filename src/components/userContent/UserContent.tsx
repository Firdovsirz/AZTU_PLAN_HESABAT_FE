import { useParams } from "react-router";
import { useEffect, useState } from "react";
import UserPlan from "../userPlan/UserPlan";
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import UserHesabat from "../userHesabat/UserHesabat";
import { getDutyByCode } from "../../services/duty/duty";
import CircularProgress from "@mui/material/CircularProgress";
import { User, getUserByFinKod } from "../../services/user/user";
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import { getFacName } from "../../services/faculty/facultyService";
import { getCafName } from "../../services/cafedra/cafedraService";
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

export default function UserContent() {
    const { finKod } = useParams();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [cafName, setCafName] = useState("");
    const [facName, setFacName] = useState("");
    const [dutyName, setDutyName] = useState("");

    useEffect(() => {
        if (finKod) {
            getUserByFinKod(finKod)
                .then((data) => {
                    setUser(data);
                })
                .finally(() => setLoading(false));
            if (user?.cafedra_code) {
                getCafName(user?.cafedra_code)
                    .then(setCafName);
            }
            if (user?.faculty_code) {
                getFacName(user?.faculty_code)
                    .then(setFacName);
            }

            if (user?.duty_code) {
                getDutyByCode(user?.duty_code)
                    .then(setDutyName);
            }
        }
    }, [finKod, user?.faculty_code, user?.duty_code]);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full h-full py-10">
                <CircularProgress />
            </div>
        );
    }

    return (
        <>
            <div className="text-gray-800 dark:text-gray-200 flex justify-start items-start">
                <div className="flex justify-start items-start mb-[10px]">
                    <div className="mr-[30px]">
                        <div className="flex justify-start items-center mb-[10px]">
                            <PersonIcon className="mr-[10px]" />
                            <p>
                                Ad, Soyad, Ata adı:&nbsp;{user?.name}&nbsp;&nbsp;{user?.surname}&nbsp;&nbsp;{user?.father_name}
                            </p>
                        </div>
                        <div className="flex justify-start items-center mb-[10px]">
                            <SchoolIcon className="mr-[10px]" />
                            <p>
                                Fakültə: {facName}&nbsp;({user?.faculty_code})
                            </p>
                        </div>
                        <div className="flex justify-start items-center mb-[10px]">
                            <SchoolIcon className="mr-[10px]" />
                            Kafedra: {cafName ? (
                                <p>{cafName}&nbsp;({user?.cafedra_code})</p>
                            ) : (
                                <p className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                    Mövcud deyil
                                </p>
                            )}
                        </div>
                        <div className="flex justify-start items-center mb-[10px]">
                            <BusinessCenterIcon className="mr-[10px]" />
                            <p>
                                Vəzifə: {dutyName}
                            </p>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-start items-center mb-[10px]">
                            İcra Statusu:&nbsp;{user?.is_execution ? (
                                <p className="bg-green-200 dark:bg-green-600 text-green-900 dark:text-green-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                    İcraçı şəxsdir
                                </p>
                            ) : (
                                <p className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                    İcraçı şəxs deyil
                                </p>
                            )}
                        </div>
                        <div className="flex justify-start items-center mb-[10px]">
                            <LocalActivityIcon className="mr-[10px]" />
                            <p>
                                Qeydiyyat tarixi: {user?.created_at ? new Date(user.created_at).toISOString().split('T')[0] : "Mövcud deyil"}
                            </p>
                        </div>
                        <div className="flex justify-start items-center mb-[10px]">
                            <AccountBalanceWalletIcon className="mr-[10px]" />
                            Profil yenilənmə tarixi: {user?.updated_at ? (
                                <p>
                                    {user?.updated_at}
                                </p>
                            ) : (
                                <p className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                    Yenilik mövcud deyil
                                </p>
                            )}
                        </div>
                    </div>
                </div >
            </div>
            <h3 className="mb-2 font-semibold text-gray-600 text-xs dark:text-white/90 sm:text-xl">
                İş planları:
            </h3>
            <UserPlan finKod={user?.fin_kod} />
            <h3 className="mb-2 font-semibold text-gray-600 text-xs dark:text-white/90 sm:text-xl">
                Hesabatlar:
            </h3>
            <UserHesabat finKod={user?.fin_kod} />
        </>
    )
}