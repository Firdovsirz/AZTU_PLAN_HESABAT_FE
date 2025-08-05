import Logo from "../../../public/logo-light.png";
import PageMeta from "../../components/common/PageMeta";
// import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";

export default function Home() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="flex flex-col justify-center items-center">
        <img src={Logo} alt="Logo" className="w-[150px] h-[200px]"/>
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          AzTU Plan Hesabat İnformasiya sistemi
        </h1>
        {/* <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />
        </div> */}
      </div>
    </>
  );
}
