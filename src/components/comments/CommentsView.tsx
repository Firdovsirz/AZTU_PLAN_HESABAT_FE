import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { AppComment, getComments } from "../../services/comment/comment";

// Read-only list of admin comments for the owner: the comments on this exact
// plan/hesabat PLUS the user-level comments that apply to all their items.
export default function CommentsView({
    targetType,
    serial,
}: {
    targetType: "plan" | "hesabat";
    serial?: string;
}) {
    const token = useSelector((s: RootState) => s.auth.token);
    const finKod = useSelector((s: RootState) => s.auth.fin_kod);
    const [comments, setComments] = useState<AppComment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!serial) {
            setLoading(false);
            return;
        }
        let cancelled = false;
        setLoading(true);
        Promise.all([
            getComments(targetType, serial, token),
            finKod ? getComments("user", finKod, token) : Promise.resolve([]),
        ])
            .then(([itemC, userC]) => {
                if (cancelled) return;
                const map = new Map<number, AppComment>();
                [...itemC, ...userC].forEach((c) => map.set(c.id, c));
                const merged = Array.from(map.values()).sort((a, b) =>
                    (b.created_at ?? "").localeCompare(a.created_at ?? "")
                );
                setComments(merged);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [targetType, serial, finKod, token]);

    const fmt = (value: string | null) => {
        if (!value) return "";
        const d = new Date(value);
        return isNaN(d.getTime())
            ? ""
            : d.toLocaleString("az-AZ", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
              });
    };

    // Nothing to show: keep the page clean (no empty section).
    if (loading || comments.length === 0) return null;

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-4 flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-warning-50 text-warning-600 ring-1 ring-inset ring-warning-200/60 dark:bg-warning-500/10 dark:text-warning-400 dark:ring-warning-500/20">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                        <path d="M3 4h14v9H7l-4 3V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                </span>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Administrator şərhləri</h3>
            </div>
            <ul className="space-y-3">
                {comments.map((c) => (
                    <li
                        key={c.id}
                        className="rounded-xl border border-gray-200 bg-gray-50/60 p-3 dark:border-gray-700/70 dark:bg-white/[0.02]"
                    >
                        <div className="mb-1 flex items-center gap-2">
                            {c.target_type === "user" ? (
                                <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-medium text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
                                    Ümumi
                                </span>
                            ) : (
                                <span className="inline-flex items-center rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                                    Bu {targetType === "plan" ? "plan" : "hesabat"}
                                </span>
                            )}
                            <span className="ml-auto text-[11px] text-gray-400">{fmt(c.created_at)}</span>
                        </div>
                        <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                            {c.comment}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
