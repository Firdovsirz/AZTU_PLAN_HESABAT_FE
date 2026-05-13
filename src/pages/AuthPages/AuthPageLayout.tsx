import React from "react";
import Logo from "../../../public/aztu_logo.webp";
import GridShape from "../../components/common/GridShape";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col items-center max-w-sm gap-6">
              <div className="relative flex items-center justify-center rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl shadow-2xl shadow-black/30">
                <img
                  width={140}
                  height={140}
                  src={Logo}
                  alt="AzTU Logo"
                  className="h-32 w-32 object-contain drop-shadow-2xl"
                />
              </div>
              <div className="text-center">
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-brand-200">
                  Azərbaycan Texniki Universiteti
                </p>
                <h2 className="text-3xl font-semibold leading-tight text-white">
                  Plan & Hesabat
                  <span className="block bg-gradient-to-r from-white via-blue-light-100 to-brand-200 bg-clip-text text-transparent">
                    İnformasiya Sistemi
                  </span>
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
