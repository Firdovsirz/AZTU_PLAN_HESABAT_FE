import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import PageMeta from "../../components/common/PageMeta";

type Lang = "az" | "en";

const translations = {
  en: {
    nav: {
      signIn: "Sign In",
    },
    hero: {
      badge: "AzTU Digital Platform",
      title: "Empowering Academic Planning & Reporting",
      subtitle:
        "An integrated platform supporting Azerbaijan Technical University in delivering transparent, structured and high-quality academic planning and reporting processes.",
      cta: "Get Started",
      learnMore: "Learn more",
    },
    plan: {
      label: "Platform",
      title: "Plan & Reporting Platform",
      description:
        "The Plan & Reporting Platform is a centralized digital system designed to support departments in preparing, managing, and monitoring annual action plans and institutional reports. The platform enables departments to document strategic objectives, track progress on planned activities, record achievements, and generate annual performance reports in a structured and transparent manner. It promotes accountability, continuous improvement, and effective communication by ensuring that planning and reporting processes are organized, accessible, and aligned with institutional goals.",
      points: [
        "Prepare and manage annual departmental action plans",
        "Track progress on planned activities and milestones",
        "Generate structured annual performance reports",
        "Promote accountability and transparent communication",
      ],
    },
    features: {
      title: "Built for Modern Academic Institutions",
      subtitle:
        "Centralized, secure, and aligned with institutional strategic goals.",
      items: [
        {
          title: "Centralized Management",
          text: "All planning and reporting data in one secure place.",
        },
        {
          title: "Transparent Workflows",
          text: "Clear review, approval and publication processes for every record.",
        },
        {
          title: "Continuous Improvement",
          text: "Data-driven insights that support academic quality and growth.",
        },
        {
          title: "Accessible Information",
          text: "Stakeholders get accurate and up-to-date information when needed.",
        },
      ],
    },
    footer: {
      rights: "All rights reserved.",
      institution: "Azerbaijan Technical University",
    },
  },
  az: {
    nav: {
      signIn: "Daxil ol",
    },
    hero: {
      badge: "AzTU Rəqəmsal Platforması",
      title: "Akademik Planlaşdırma və Hesabatın İdarə Edilməsi",
      subtitle:
        "Azərbaycan Texniki Universitetində şəffaf, strukturlu və yüksək keyfiyyətli akademik planlaşdırma və hesabat proseslərini dəstəkləyən inteqrasiya olunmuş platforma.",
      cta: "Başla",
      learnMore: "Ətraflı",
    },
    plan: {
      label: "Platforma",
      title: "Plan və Hesabat Platforması",
      description:
        "Plan və Hesabat Platforması kafedraların illik fəaliyyət planlarının və institutional hesabatlarının hazırlanması, idarə olunması və monitorinqi üçün nəzərdə tutulmuş mərkəzləşdirilmiş rəqəmsal sistemdir. Platforma kafedralara strateji məqsədləri sənədləşdirməyə, planlaşdırılan fəaliyyətlərin icrasını izləməyə, nailiyyətləri qeyd etməyə və illik fəaliyyət hesabatlarını strukturlu və şəffaf şəkildə hazırlamağa imkan verir. Bu, planlaşdırma və hesabat proseslərinin nizamlı, əlçatan və müəssisənin strateji məqsədləri ilə uzlaşdırılmış olmasını təmin edərək hesabatlılığı, davamlı təkmilləşməni və effektiv kommunikasiyanı dəstəkləyir.",
      points: [
        "Kafedraların illik fəaliyyət planlarını hazırlayın və idarə edin",
        "Planlaşdırılan fəaliyyətlərin icrasını və mərhələlərini izləyin",
        "Strukturlu illik fəaliyyət hesabatları yaradın",
        "Hesabatlılığı və şəffaf kommunikasiyanı dəstəkləyin",
      ],
    },
    features: {
      title: "Müasir Təhsil Müəssisələri Üçün Hazırlanıb",
      subtitle:
        "Mərkəzləşdirilmiş, təhlükəsiz və institutional strateji məqsədlərlə uzlaşdırılmış.",
      items: [
        {
          title: "Mərkəzləşdirilmiş İdarəetmə",
          text: "Bütün planlaşdırma və hesabat məlumatları bir təhlükəsiz mərkəzdə.",
        },
        {
          title: "Şəffaf İş Axını",
          text: "Hər bir qeyd üçün aydın nəzərdən keçirmə, təsdiq və dərc prosesləri.",
        },
        {
          title: "Davamlı Təkmilləşmə",
          text: "Akademik keyfiyyət və inkişafı dəstəkləyən məlumat əsaslı yanaşma.",
        },
        {
          title: "Əlçatan Məlumat",
          text: "Maraqlı tərəflər lazım olduqda dəqiq və yenilənmiş məlumat alır.",
        },
      ],
    },
    footer: {
      rights: "Bütün hüquqlar qorunur.",
      institution: "Azərbaycan Texniki Universiteti",
    },
  },
};

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [lang, setLang] = useState<Lang>(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("landing-lang") : null;
    return stored === "en" || stored === "az" ? stored : "az";
  });

  useEffect(() => {
    localStorage.setItem("landing-lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = translations[lang];

  return (
    <>
      <PageMeta
        title="AzTU | Plan və Hesabat Platforması"
        description="Azərbaycan Texniki Universiteti Plan və Hesabat platforması haqqında məlumat."
      />
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/aztu_logo.webp"
                alt="AzTU"
                className="h-10 w-10 rounded-full object-contain"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-semibold leading-tight text-gray-900 dark:text-white">
                  AzTU
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t.footer.institution}
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center rounded-full border border-gray-200 bg-white p-0.5 dark:border-gray-800 dark:bg-gray-900">
                <button
                  onClick={() => setLang("az")}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    lang === "az"
                      ? "bg-brand-500 text-white"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  AZ
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    lang === "en"
                      ? "bg-brand-500 text-white"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  EN
                </button>
              </div>

              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                {theme === "dark" ? (
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10 1.54a.75.75 0 0 1 .75.75v1.25a.75.75 0 0 1-1.5 0V2.29A.75.75 0 0 1 10 1.54Zm0 5.25a3.21 3.21 0 1 0 0 6.42 3.21 3.21 0 0 0 0-6.42ZM5.29 10a4.71 4.71 0 1 1 9.42 0 4.71 4.71 0 0 1-9.42 0Zm10.69-4.92a.75.75 0 0 0-1.06-1.06l-.88.88a.75.75 0 0 0 1.06 1.06l.88-.88ZM18.46 10a.75.75 0 0 1-.75.75h-1.25a.75.75 0 1 1 0-1.5h1.25a.75.75 0 0 1 .75.75Zm-3.54 5.98a.75.75 0 0 0 1.06-1.06l-.88-.88a.75.75 0 0 0-1.06 1.06l.88.88ZM10 15.71a.75.75 0 0 1 .75.75v1.25a.75.75 0 1 1-1.5 0v-1.25a.75.75 0 0 1 .75-.75Zm-4.04-.63a.75.75 0 1 0-1.06-1.06l-.88.88a.75.75 0 1 0 1.06 1.06l.88-.88ZM4.29 10a.75.75 0 0 1-.75.75H2.29a.75.75 0 1 1 0-1.5h1.25a.75.75 0 0 1 .75.75Zm.61-4.04a.75.75 0 1 0 1.06-1.06l-.88-.88a.75.75 0 1 0-1.06 1.06l.88.88Z"
                      fill="currentColor"
                    />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M17.45 11.97a7.46 7.46 0 0 1-9.42-9.42A8.46 8.46 0 1 0 17.45 11.97Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </button>

              <Link
                to="/signin"
                className="inline-flex h-10 items-center justify-center rounded-full bg-brand-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
              >
                {t.nav.signIn}
              </Link>
            </div>
          </div>
        </header>

        <main>
          {/* Hero */}
          <section className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-0 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl dark:bg-brand-500/10" />
            </div>
            <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
              <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300">
                {t.hero.badge}
              </span>
              <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
                {t.hero.title}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base text-gray-600 sm:text-lg dark:text-gray-400">
                {t.hero.subtitle}
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/signin"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-brand-500 px-6 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition-colors hover:bg-brand-600"
                >
                  {t.hero.cta}
                </Link>
                <a
                  href="#platforms"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-gray-200 bg-white px-6 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {t.hero.learnMore}
                </a>
              </div>
            </div>
          </section>

          {/* Platforms */}
          <section id="platforms" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid gap-8">
              {[t.plan].map((p, idx) => (
                <div
                  key={p.title}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 transition-shadow hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
                >
                  <div
                    className={`absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl ${
                      idx === 0 ? "bg-brand-500/10" : "bg-emerald-500/10"
                    }`}
                  />
                  <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {p.label}
                  </span>
                  <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                    {p.title}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {p.description}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {p.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                            idx === 0
                              ? "bg-brand-500/10 text-brand-500"
                              : "bg-emerald-500/10 text-emerald-500"
                          }`}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path
                              d="M2.5 6.5l2.5 2.5 4.5-5"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section className="border-t border-gray-200 bg-gray-50 py-16 dark:border-gray-800 dark:bg-gray-900/50 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
                  {t.features.title}
                </h2>
                <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
                  {t.features.subtitle}
                </p>
              </div>
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {t.features.items.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M4 10l4 4 8-9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-gray-200 dark:border-gray-800">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-gray-500 sm:flex-row sm:px-6 lg:px-8 dark:text-gray-400">
            <p>
              © {new Date().getFullYear()} {t.footer.institution}. {t.footer.rights}
            </p>
            <Link
              to="/signin"
              className="font-medium text-brand-500 hover:text-brand-600"
            >
              {t.nav.signIn}
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
}
