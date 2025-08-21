import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "../../redux/store";
import Skeleton from "@mui/material/Skeleton";
import { getDutyByCode } from "../../services/duty/duty";
import ProfileImage from "../../../public/profile_photo.webp";
import { getUserByFinKod, User } from "../../services/user/user";

export default function UserMetaCard() {
  const [user, setUser] = useState<User>();
  const [dutyName, setDutyName] = useState("");
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.token);
  const finKod = useSelector((state: RootState) => state.auth.fin_kod);

  useEffect(() => {
    if (finKod) {
      getUserByFinKod(finKod, token ? token : '')
        .then(setUser)
      getDutyByCode(user?.duty_code ? user?.duty_code : 0, token ? token : '')
        .then(setDutyName)
        .finally(() => { setLoading(false) })
    }
  }, [finKod]);

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img src={ProfileImage} alt="user" />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {loading ? (
                  <Skeleton variant="text" width={150} height={24} />
                ) : (
                  <>
                    {user?.name} {user?.surname} {user?.father_name}
                  </>
                )}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <span className="text-sm font-medium text-gray-700 dark:text-white/90">Vəzifə:</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {loading ? (
                    <Skeleton variant="text" width={150} height={24} />
                  ) : !dutyName ? (
                    <div className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block">
                      Məlumat yoxdur
                    </div>
                  ) : (
                    <>
                      {user?.duty_code}
                    </>
                  )}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Azərbaycan Texniki Universiteti
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
