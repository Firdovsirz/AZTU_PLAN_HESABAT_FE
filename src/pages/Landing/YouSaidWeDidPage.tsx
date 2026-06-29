import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import PageMeta from "../../components/common/PageMeta";
import { YouSaidWeDid, getYouSaidWeDid } from "../../services/feedback/feedback";

type Lang = "az" | "en";

const translations: Record<
  Lang,
  {
    nav: { signIn: string; home: string };
    meta: { title: string; description: string };
    hero: { badge: string; title: string; subtitle: string; back: string };
    youSaid: string;
    weDid: string;
    empty: string;
    status: { in_progress: string; done: string };
    footer: { rights: string; institution: string };
  }
> = {
  az: {
    nav: { signIn: "Daxil ol", home: "Ana səhifə" },
    meta: {
      title: "AzTU | Siz dediniz, Biz etdik",
      description:
        "Maraqlı tərəflərin rəyləri və onlara cavab olaraq görülən işlər.",
    },
    hero: {
      badge: "Geri bildirim",
      title: "Siz dediniz, Biz etdik",
      subtitle:
        "Rəyləriniz davamlı təkmilləşmələrimizi necə formalaşdırır.",
      back: "Ana səhifəyə qayıt",
    },
    youSaid: "Siz dediniz",
    weDid: "Biz etdik",
    empty: "Hələ heç bir qeyd yoxdur.",
    status: { in_progress: "İcradadır", done: "Tamamlandı" },
    footer: {
      rights: "Bütün hüquqlar qorunur.",
      institution: "Azərbaycan Texniki Universiteti",
    },
  },
  en: {
    nav: { signIn: "Sign In", home: "Home" },
    meta: {
      title: "AzTU | You Said, We Did",
      description:
        "Stakeholder feedback and the actions taken in response.",
    },
    hero: {
      badge: "Feedback",
      title: "You Said, We Did",
      subtitle: "How your feedback shapes our continuous improvements.",
      back: "Back to home",
    },
    youSaid: "You said",
    weDid: "We did",
    empty: "No entries yet.",
    status: { in_progress: "In progress", done: "Done" },
    footer: {
      rights: "All rights reserved.",
      institution: "Azerbaijan Technical University",
    },
  },
};

export default function YouSaidWeDidPublicPage() {
  const { theme, toggleTheme } = useTheme();
  const [lang, setLang] = useState<Lang>(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("landing-lang") : null;
    return stored === "en" || stored === "az" ? stored : "az";
  });
  const [items, setItems] = useState<YouSaidWeDid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem("landing-lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    getYouSaidWeDid()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

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

          {/* Entries */}
          <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-40 animate-pulse rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900"
                  />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-20 text-center dark:border-gray-700 dark:bg-gray-900/40">
                <p className="text-base font-medium text-gray-600 dark:text-gray-300">
                  {t.empty}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="border-b border-gray-100 bg-brand-500/5 px-6 py-5 dark:border-gray-800">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                        {t.youSaid}
                      </p>
                      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                        {lang === "az" ? item.you_said_az : item.you_said_en}
                      </p>
                    </div>
                    <div className="px-6 py-5">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          {t.weDid}
                        </p>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            item.status === "in_progress"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                              : "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300"
                          }`}
                        >
                          {item.status === "in_progress" ? t.status.in_progress : t.status.done}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                        {lang === "az" ? item.we_did_az : item.we_did_en}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-12 flex justify-center">
              <Link
                to="/"
                className="inline-flex h-12 items-center justify-center rounded-full border border-gray-200 bg-white px-6 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {t.hero.back}
              </Link>
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
