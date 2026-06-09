import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import PageMeta from "../../components/common/PageMeta";

type Lang = "az" | "en";

type Step = {
  image: string;
  title: string;
  body: string[];
};

const translations: Record<
  Lang,
  {
    nav: { signIn: string; home: string };
    meta: { title: string; description: string };
    hero: { badge: string; title: string; subtitle: string; back: string };
    stepLabel: string;
    steps: Step[];
    cta: { title: string; text: string; button: string };
    footer: { rights: string; institution: string };
  }
> = {
  az: {
    nav: { signIn: "Daxil ol", home: "Ana səhifə" },
    meta: {
      title: "AzTU | Necə istifadə etməli?",
      description:
        "AzTU Plan və Hesabat platformasından addım-addım necə istifadə olunacağına dair təlimat.",
    },
    hero: {
      badge: "Təlimat",
      title: "Necə istifadə etməli?",
      subtitle:
        "Qeydiyyatdan tutmuş hesabatın təqdim edilməsinə qədər platformadan istifadənin addım-addım izahı.",
      back: "Ana səhifəyə qayıt",
    },
    stepLabel: "Addım",
    steps: [
      {
        image: "/images/how-to-use/1-register.png",
        title: "Qeydiyyat",
        body: [
          "Qeydiyyat səhifəsində bütün xanaları doldurun və qeydiyyat sorğusunu göndərin.",
          "Sorğunu göndərdikdən sonra administratorun təsdiqini gözləyin. Təsdiq barədə bildiriş qeydiyyatdan keçdiyiniz e-poçt ünvanına göndəriləcək.",
          "Qeydiyyat üçün mütləq korporativ @aztu.edu.az e-poçt ünvanından istifadə edin — əks halda qeydiyyatınız təsdiqlənməyəcək.",
        ],
      },
      {
        image: "/images/how-to-use/2-login.png",
        title: "Sistemə daxil olma",
        body: [
          "Sistemə daxil olmaq üçün FİN kodunuzu və şifrənizi daxil edin.",
        ],
      },
      {
        image: "/images/how-to-use/3-dashboard.png",
        title: "Əsas səhifə (İdarə paneli)",
        body: [
          "Daxil olduqdan sonra idarə panelinin sol tərəfindəki menyudan istifadə edə bilərsiniz:",
          "«Yeni Plan» — yeni plan yaratmaq üçün.",
          "«Planım» — bütün planlarınıza baxmaq üçün.",
          "«Hesabatım» — bütün hesabatlarınıza baxmaq üçün.",
        ],
      },
      {
        image: "/images/how-to-use/4-new-plan.png",
        title: "Yeni plan yaratma",
        body: [
          "Yeni plan səhifəsində bütün xanaları doldurun.",
          "Fakültə əməkdaşları tədris ilini akademik il formatında (məsələn 2025–2026, 2026–2027) seçməlidir; struktur bölmələri isə cari ili tək il olaraq seçir.",
          "Fəaliyyət növünü seçin, son tarixi (deadline) təyin edin, plan üçün təsvir əlavə edin və hədəfinizi (məqsədinizi) göstərin.",
          "Məlumatları yoxlayıb «Təsdiq et» düyməsi ilə planı təqdim edin.",
        ],
      },
      {
        image: "/images/how-to-use/5-my-plans.png",
        title: "Planım — planlara baxış",
        body: [
          "Planı təsdiq etdikdən sonra bütün planlarınız «Planım» səhifəsində görünəcək.",
          "Planın təfərrüatlarına baxmaq üçün sətirdəki göz (👁) işarəsinə klikləyin.",
        ],
      },
      {
        image: "/images/how-to-use/6-my-reports.png",
        title: "Hesabatım — hesabatlara baxış",
        body: [
          "«Hesabatım» səhifəsində bütün hesabatlarınız görünür.",
          "Hesabatı açmaq üçün sətirdəki göz (👁) işarəsinə klikləyin.",
        ],
      },
      {
        image: "/images/how-to-use/7-report-details.png",
        title: "Hesabatın təqdim edilməsi",
        body: [
          "Hesabat təfərrüatları səhifəsində hesabatın sənədini yükləyin və ya sənədin URL-ni (məsələn, Google Docs linkini) əlavə edin.",
          "Daha sonra özünüzə qiymət verin: 2 (Kafi), 3 (Orta), 4 (Yaxşı), 5 (Əla).",
          "Səhifənin aşağısında hesabatı təqdim edin. Təqdim etdikdən sonra hesabatınız administrator tərəfindən qiymətləndiriləcək.",
        ],
      },
    ],
    cta: {
      title: "Başlamağa hazırsınız?",
      text: "Hesabınıza daxil olun və ilk planınızı yaradın.",
      button: "Sistemə daxil ol",
    },
    footer: {
      rights: "Bütün hüquqlar qorunur.",
      institution: "Azərbaycan Texniki Universiteti",
    },
  },
  en: {
    nav: { signIn: "Sign In", home: "Home" },
    meta: {
      title: "AzTU | How to use?",
      description:
        "A step-by-step guide on how to use the AzTU Plan & Reporting platform.",
    },
    hero: {
      badge: "Guide",
      title: "How to use?",
      subtitle:
        "A step-by-step walkthrough of the platform, from registration to submitting your report.",
      back: "Back to home",
    },
    stepLabel: "Step",
    steps: [
      {
        image: "/images/how-to-use/1-register.png",
        title: "Registration",
        body: [
          "On the registration page, fill in all the fields and submit your registration request.",
          "After submitting, wait for the administrator's approval. The approval notification will be sent to the email address you registered with.",
          "You must register with your corporate @aztu.edu.az email — otherwise your registration will not be approved.",
        ],
      },
      {
        image: "/images/how-to-use/2-login.png",
        title: "Signing in",
        body: ["Use your FIN code and password to log in to the system."],
      },
      {
        image: "/images/how-to-use/3-dashboard.png",
        title: "Home page (Dashboard)",
        body: [
          "Once you are signed in, use the menu on the left side of the dashboard:",
          "“Yeni Plan (New Plan)” — to create a new plan.",
          "“Planım (My Plans)” — to view all of your plans.",
          "“Hesabatım (My Reports)” — to view all of your reports.",
        ],
      },
      {
        image: "/images/how-to-use/4-new-plan.png",
        title: "Creating a new plan",
        body: [
          "On the new plan page, fill in all the fields.",
          "Faculty staff should select the teaching year in academic-year format (e.g. 2025–2026, 2026–2027); structural units select the current single year.",
          "Choose the activity type, set the deadline, add a description for the plan and define your goal (Hədəf).",
          "Review the details and submit the plan with the “Təsdiq et (Confirm)” button.",
        ],
      },
      {
        image: "/images/how-to-use/5-my-plans.png",
        title: "My Plans — viewing plans",
        body: [
          "After submitting the plan, all of your plans appear on the “Planım (My Plans)” page.",
          "Click the eye (👁) icon on a row to see the details of that plan.",
        ],
      },
      {
        image: "/images/how-to-use/6-my-reports.png",
        title: "My Reports — viewing reports",
        body: [
          "All of your reports are visible on the “Hesabatım (My Reports)” page.",
          "Open a report by clicking the eye (👁) icon on its row.",
        ],
      },
      {
        image: "/images/how-to-use/7-report-details.png",
        title: "Submitting a report",
        body: [
          "On the report details page, upload the report document or add the document URL (for example a Google Docs link).",
          "Then give yourself an assessment: 2 (Kafi / Satisfactory), 3 (Orta / Average), 4 (Yaxşı / Good), 5 (Əla / Excellent).",
          "Submit the report at the bottom of the page. After submission, your report will be assessed by the administrator.",
        ],
      },
    ],
    cta: {
      title: "Ready to get started?",
      text: "Sign in to your account and create your first plan.",
      button: "Sign in to the system",
    },
    footer: {
      rights: "All rights reserved.",
      institution: "Azerbaijan Technical University",
    },
  },
};

type Callout = {
  x: number; // horizontal position as % of the image width
  y: number; // vertical position as % of the image height
  place?: "top" | "bottom" | "left" | "right"; // where the label sits relative to the marker
  az?: string;
  en?: string;
};

// Callouts are aligned to the order of `steps`. Coordinates are percentages
// so the markers track the image at any size. Labels are language-specific.
const STEP_CALLOUTS: Callout[][] = [
  // 1 — register
  [
    { x: 31.8, y: 39.4, place: "bottom", az: "@aztu.edu.az e-poçt", en: "@aztu.edu.az email" },
    { x: 24.7, y: 96.5, place: "top", az: "Qeydiyyatı göndər", en: "Submit registration" },
  ],
  // 2 — login
  [
    { x: 30, y: 46.9, place: "right", az: "FİN kod", en: "FIN code" },
    { x: 30, y: 59.7, place: "right", az: "Şifrə", en: "Password" },
    { x: 30, y: 73, place: "right", az: "Daxil ol", en: "Sign in" },
  ],
  // 3 — dashboard (left menu — rings only, items are already labelled in the UI)
  [
    { x: 8, y: 26.4 },
    { x: 8, y: 32.9 },
    { x: 8, y: 39.3 },
  ],
  // 4 — new plan
  [
    { x: 78.7, y: 38.9, place: "top", az: "İş ili", en: "Work year" },
    { x: 41, y: 51.4, place: "top", az: "Fəaliyyət növü", en: "Activity type" },
    { x: 78.7, y: 51.8, place: "top", az: "Son tarix", en: "Deadline" },
    { x: 59.8, y: 90.7, place: "top", az: "Təsdiq et", en: "Submit" },
  ],
  // 5 — my plans (eye icon)
  [{ x: 86, y: 43.8, place: "top", az: "Detallara bax", en: "View details" }],
  // 6 — my reports (eye icon)
  [{ x: 93.5, y: 44.5, place: "top", az: "Hesabatı aç", en: "Open report" }],
  // 7 — report details (visible self-assessment field; upload/submit are below the frame)
  [{ x: 41.7, y: 95.5, place: "top", az: "Özünə qiymət ver (2–5)", en: "Self-assessment (2–5)" }],
];

const PILL_POSITION: Record<NonNullable<Callout["place"]>, string> = {
  bottom: "left-1/2 top-full mt-2 -translate-x-1/2",
  top: "left-1/2 bottom-full mb-2 -translate-x-1/2",
  right: "top-1/2 left-full ml-2 -translate-y-1/2",
  left: "top-1/2 right-full mr-2 -translate-y-1/2",
};

function CalloutMarker({ c, label }: { c: Callout; label?: string }) {
  return (
    <div
      className="pointer-events-none absolute z-10"
      style={{ left: `${c.x}%`, top: `${c.y}%` }}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <span className="block h-5 w-5 animate-pulse rounded-full border-2 border-brand-500 bg-brand-500/25 ring-4 ring-brand-500/20 sm:h-6 sm:w-6" />
        {label ? (
          <span
            className={`absolute whitespace-nowrap rounded-md bg-brand-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-lg sm:text-[11px] ${
              PILL_POSITION[c.place ?? "bottom"]
            }`}
          >
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default function HowToUsePage() {
  const { theme, toggleTheme } = useTheme();
  const [lang, setLang] = useState<Lang>(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("landing-lang") : null;
    return stored === "en" || stored === "az" ? stored : "az";
  });

  useEffect(() => {
    localStorage.setItem("landing-lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = translations[lang];

  return (
    <>
      <PageMeta title={t.meta.title} description={t.meta.description} />
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
        {/* Header — identical shell to the landing page */}
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
              <Link
                to="/"
                className="hidden rounded-full px-3 py-1 text-xs font-semibold text-gray-500 transition-colors hover:text-gray-700 sm:inline-flex dark:text-gray-400 dark:hover:text-white"
              >
                {t.nav.home}
              </Link>

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
            <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
              <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300">
                {t.hero.badge}
              </span>
              <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-white">
                {t.hero.title}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base text-gray-600 sm:text-lg dark:text-gray-400">
                {t.hero.subtitle}
              </p>
            </div>
          </section>

          {/* Steps */}
          <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
            <div className="space-y-10 lg:space-y-16">
              {t.steps.map((step, idx) => {
                const reversed = idx % 2 === 1;
                return (
                  <div
                    key={step.title}
                    className="relative grid items-center gap-6 rounded-2xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-xl sm:p-6 lg:grid-cols-2 lg:gap-10 lg:p-8 dark:border-gray-800 dark:bg-gray-900"
                  >
                    {/* Image */}
                    <div
                      className={`relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm dark:border-gray-800 dark:bg-gray-950 ${
                        reversed ? "lg:order-2" : "lg:order-1"
                      }`}
                    >
                      <img
                        src={step.image}
                        alt={`${t.stepLabel} ${idx + 1}: ${step.title}`}
                        loading="lazy"
                        className="h-auto w-full object-contain"
                      />
                      {(STEP_CALLOUTS[idx] ?? []).map((c, ci) => (
                        <CalloutMarker
                          key={ci}
                          c={c}
                          label={lang === "az" ? c.az : c.en}
                        />
                      ))}
                    </div>

                    {/* Text */}
                    <div className={reversed ? "lg:order-1" : "lg:order-2"}>
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-500 text-base font-bold text-white shadow-lg shadow-brand-500/30">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wide text-brand-500">
                          {t.stepLabel} {idx + 1}
                        </span>
                      </div>
                      <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                        {step.title}
                      </h2>
                      <ul className="mt-4 space-y-3">
                        {step.body.map((line) => (
                          <li key={line} className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-500">
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                              >
                                <path
                                  d="M2.5 6.5l2.5 2.5 4.5-5"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                            <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                              {line}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-gray-200 bg-gray-50 py-16 dark:border-gray-800 dark:bg-gray-900/50 lg:py-20">
            <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
                {t.cta.title}
              </h2>
              <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
                {t.cta.text}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/signin"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-brand-500 px-6 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition-colors hover:bg-brand-600"
                >
                  {t.cta.button}
                </Link>
                <Link
                  to="/"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-gray-200 bg-white px-6 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {t.hero.back}
                </Link>
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
