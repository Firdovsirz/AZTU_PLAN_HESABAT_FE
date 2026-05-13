import { Link } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Logo from "../../../public/aztu_logo.webp";
import PageMeta from "../../components/common/PageMeta";

type QuickLink = {
  to: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
};

const quickLinks: QuickLink[] = [
  {
    to: "/my-plan",
    title: "Planım",
    description: "Cari tədris ili üzrə fərdi planınızı idarə edin.",
    icon: <WorkIcon className="size-6 text-white" />,
    gradient: "from-brand-500 via-brand-600 to-brand-800",
    iconBg: "bg-white/15",
  },
  {
    to: "/my-hesabat",
    title: "Hesabatım",
    description: "Yerinə yetirilmiş işlər üzrə hesabatınızı təqdim edin.",
    icon: <AssessmentIcon className="size-6 text-white" />,
    gradient: "from-blue-light-500 via-blue-light-600 to-blue-light-800",
    iconBg: "bg-white/15",
  },
  {
    to: "/profile",
    title: "Şəxsi məlumatlar",
    description: "Profil məlumatlarınıza baxın və yeniləyin.",
    icon: <AccountCircleIcon className="size-6 text-white" />,
    gradient: "from-theme-purple-500 via-brand-600 to-brand-900",
    iconBg: "bg-white/15",
  },
];

export default function Home() {
  return (
    <>
      <PageMeta
        title="Plan Hesabat AzTU"
        description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
      />

      <section className="relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-6 shadow-[0_30px_80px_-30px_rgba(70,95,255,0.55)] sm:p-10 dark:border-white/5">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-blue-light-400/20 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
          />
        </div>

        <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-5 max-w-2xl">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.9)]" />
              Azərbaycan Texniki Universiteti
            </span>
            <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              AzTU Plan & Hesabat
              <span className="block bg-gradient-to-r from-white via-blue-light-100 to-brand-100 bg-clip-text text-transparent">
                İnformasiya Sistemi
              </span>
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
              Tədris ili üzrə planlarınızı tərtib edin, hesabatlarınızı təqdim edin
              və universitetin akademik proseslərini vahid platformadan idarə edin.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/new-plan"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 shadow-lg shadow-black/10 transition hover:bg-brand-50"
              >
                Yeni plan yarat
                <ArrowForwardIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/my-plan"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Planlarıma bax
              </Link>
            </div>
          </div>

          <div className="relative shrink-0">
            <div className="absolute -inset-6 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex h-36 w-36 items-center justify-center rounded-3xl border border-white/30 bg-white/15 p-5 backdrop-blur-xl shadow-2xl shadow-black/20 sm:h-44 sm:w-44">
              <img src={Logo} alt="AzTU Logo" className="h-full w-full object-contain drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {quickLinks.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div
              className={`pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br ${item.gradient} opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20`}
            />
            <div className="relative flex items-start justify-between">
              <div
                className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} p-3 shadow-lg shadow-brand-500/20 ring-1 ring-white/20`}
              >
                {item.icon}
              </div>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-all duration-300 group-hover:border-brand-500 group-hover:bg-brand-500 group-hover:text-white dark:border-gray-700">
                <ArrowForwardIcon className="size-4" />
              </span>
            </div>

            <div className="relative mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
