import { Link } from "react-router";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import UserPlan from "../userPlan/UserPlan";
import { RootState } from "../../redux/store";
import Skeleton from '@mui/material/Skeleton';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import UserHesabat from "../userHesabat/UserHesabat";
import { getDutyByCode } from "../../services/duty/duty";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { User, getUserByFinKod } from "../../services/user/user";
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import { getFacName } from "../../services/faculty/facultyService";
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { getCafDetails, CafedraDetailsInterface } from "../../services/cafedra/cafedraService";

export default function UserContent() {
    const { finKod } = useParams();

    const [facName, setFacName] = useState("");
    const [loading, setLoading] = useState(true);
    const [dutyName, setDutyName] = useState("");
    const [user, setUser] = useState<User | null>(null);
    const token = useSelector((state: RootState) => state.auth.token);
    const role = useSelector((state: RootState) => state.auth.role);
    const [cafDetails, setCafDetails] = useState<CafedraDetailsInterface[] | string>([]);

    useEffect(() => {
        if (finKod) {
            getUserByFinKod(finKod, token ? token : '')
                .then((data) => {
                    setUser(data);
                })
                .finally(() => setLoading(false));
            if (user?.cafedra_code) {
                getCafDetails(user?.cafedra_code, token ? token : '')
                    .then(setCafDetails);
            }
            if (user?.faculty_code) {
                getFacName(user?.faculty_code, token ? token : '')
                    .then(setFacName);
            }

            if (user?.duty_code) {
                getDutyByCode(user?.duty_code, token ? token : '')
                    .then(setDutyName);
            }
        }
    }, [finKod, user?.faculty_code, user?.duty_code]);

    if (loading) {
        return (
            <div className="flex flex-col w-full p-6 space-y-4">
                <div className="flex space-x-6">
                    <div className="flex items-center space-x-2">
                        <PersonIcon className="text-white"/>
                        <Skeleton variant="text" width={250} height={30} />
                    </div>
                </div>
                <div className="flex space-x-6">
                    <div className="flex items-center space-x-2">
                        <SchoolIcon  className="text-white"/>
                        <Skeleton variant="text" width={200} height={30} />
                    </div>
                </div>
                <div className="flex space-x-6">
                    <div className="flex items-center space-x-2">
                        <SchoolIcon  className="text-white"/>
                        <Skeleton variant="text" width={220} height={30} />
                    </div>
                </div>
                <div className="flex space-x-6">
                    <div className="flex items-center space-x-2">
                        <BusinessCenterIcon  className="text-white"/>
                        <Skeleton variant="text" width={180} height={30} />
                    </div>
                </div>
                <div className="flex space-x-6 mt-4">
                    <div className="flex items-center space-x-2">
                        <Skeleton variant="rectangular" width={150} height={30} />
                    </div>
                    <div className="flex items-center space-x-2">
                        <LocalActivityIcon  className="text-white"/>
                        <Skeleton variant="text" width={200} height={30} />
                    </div>
                    <div className="flex items-center space-x-2">
                        <AccountBalanceWalletIcon  className="text-white"/>
                        <Skeleton variant="text" width={200} height={30} />
                    </div>
                </div>
            </div>
        );
    }
    console.log(user);


    return (
        <>
            {role === 1 ? (
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
                                {Array.isArray(cafDetails) && cafDetails.length > 0 ? (
                                    <div className="flex justify-start items-center mb-[10px]">
                                        <SchoolIcon className="mr-[10px]" />
                                        Kafedra: {cafDetails[0].cafedra_code ? (
                                            <p>{cafDetails[0].cafedra_name}&nbsp;({user?.cafedra_code})</p>
                                        ) : (
                                            <p className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                                                Mövcud deyil
                                            </p>
                                        )}
                                    </div>
                                ) : null}
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
            ) : (
                <div className="flex flex-col items-center justify-center p-6 mt-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-center">
                    <ErrorOutlineIcon className="text-red-500 dark:text-red-400 mb-2" style={{ fontSize: 40 }} />
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                        Bu səhifəyə baxmaq üçün icazəniz yoxdur
                    </p>
                    <Link
                        to="/home"
                        className="mt-[20px] inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                        Əsas səhifəyə qayıt
                    </Link>
                </div>
            )}
        </>
    )
}