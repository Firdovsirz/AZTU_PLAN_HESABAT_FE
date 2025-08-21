import { Link } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import Logo from "../../../public/logo-light.png";
import PageMeta from "../../components/common/PageMeta";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Home() {
  return (
    <>
      <PageMeta
        title="Plan Hesabat AzTU"
        description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
      />
      <div className="flex flex-col justify-center items-center">
        <img src={Logo} alt="Logo" className="w-[150px] h-[200px]" />
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          AzTU Plan Hesabat İnformasiya sistemi
        </h1>
        <div className="mt-[50px] px-4 py-4 flex flex-col gap-4 md:flex-row md:justify-between md:items-center w-full">
          <Link to={`/my-plan`} className={`w-full md:w-[calc((100% / 3) - 10px)]`}>
            <div className={`rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 cursor-pointer`}>
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                <WorkIcon className="text-gray-800 size-6 dark:text-white/90" />
              </div>

              <div className="flex items-end justify-between mt-5">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Planım
                  </span>
                </div>
              </div>
            </div>
          </Link>
          <Link to={`/my-hesabat`} className={`w-full md:w-[calc((100% / 3) - 10px)]`}>
            <div className={`rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 cursor-pointer`}>
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                <WorkIcon className="text-gray-800 size-6 dark:text-white/90" />
              </div>

              <div className="flex items-end justify-between mt-5">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Hesabatım
                  </span>
                </div>
              </div>
            </div>
          </Link>
          <Link to={`/profile`} className={`w-full md:w-[calc((100% / 3) - 10px)]`}>
            <div className={`rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 cursor-pointer`}>
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                <AccountCircleIcon className="text-gray-800 size-6 dark:text-white/90" />
              </div>

              <div className="flex items-end justify-between mt-5">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Şəxsi məlumatlar
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
