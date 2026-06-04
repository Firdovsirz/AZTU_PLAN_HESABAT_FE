import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import Skeleton from "@mui/material/Skeleton";
import apiClient from "../../util/apiClient";

type ViewerKind = "pdf" | "docx" | "image" | "unsupported";

const getKind = (extension: string): ViewerKind => {
    if (extension === "pdf") return "pdf";
    if (extension === "doc" || extension === "docx") return "docx";
    if (["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(extension)) return "image";
    return "unsupported";
};

export default function DocView() {
    const location = useLocation();
    // Strip the leading `/doc/` segment; the rest is the document path on the API host.
    const docPath = location.pathname.replace(/^\/doc\//, "");

    const docxContainerRef = useRef<HTMLDivElement | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [blobUrl, setBlobUrl] = useState("");

    const extension = docPath.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
    const kind = getKind(extension);

    useEffect(() => {
        let objectUrl = "";
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError("");
            try {
                // apiClient attaches the auth token (api key) via its request interceptor,
                // so protected documents are fetched authenticated and rendered locally.
                const response = await apiClient.get(docPath, { responseType: "blob" });
                if (cancelled) return;
                const blob = response.data as Blob;

                if (kind === "docx") {
                    if (docxContainerRef.current) {
                        docxContainerRef.current.innerHTML = "";
                        await renderAsync(blob, docxContainerRef.current, undefined, {
                            className: "docx",
                            inWrapper: true,
                        });
                    }
                } else {
                    objectUrl = URL.createObjectURL(blob);
                    if (!cancelled) setBlobUrl(objectUrl);
                }
            } catch (err) {
                if (!cancelled) setError("Sənəd yüklənə bilmədi.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        if (docPath) {
            load();
        } else {
            setError("Sənəd tapılmadı.");
            setLoading(false);
        }

        return () => {
            cancelled = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [docPath, kind]);

    return (
        <div style={{ width: "100%", height: "100vh", margin: 0, padding: 0 }} className="relative bg-white dark:bg-gray-900">
            {loading && (
                <div className="absolute inset-0 z-10 p-6 bg-white dark:bg-gray-900">
                    <Skeleton variant="rectangular" height="100%" sx={{ borderRadius: 2 }} />
                </div>
            )}

            {error && !loading && (
                <div className="flex h-full w-full items-center justify-center text-red-500 font-medium">
                    {error}
                </div>
            )}

            {!error && kind === "docx" && (
                <div
                    ref={docxContainerRef}
                    className="h-full w-full overflow-auto bg-gray-100 dark:bg-gray-800 flex justify-center"
                />
            )}

            {!error && kind === "pdf" && blobUrl && (
                <iframe
                    src={blobUrl}
                    style={{ width: "100%", height: "100%", border: "none", overflow: "hidden" }}
                    title="Document Viewer"
                />
            )}

            {!error && kind === "image" && blobUrl && (
                <div className="h-full w-full overflow-auto flex justify-center items-start bg-gray-100 dark:bg-gray-800">
                    <img src={blobUrl} alt="Sənəd" className="max-w-full h-auto" />
                </div>
            )}

            {!error && kind === "unsupported" && !loading && (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-gray-600 dark:text-gray-300">
                    <p>Bu sənəd növü brauzerdə göstərilə bilmir.</p>
                    {blobUrl && (
                        <a
                            href={blobUrl}
                            download={docPath.split("/").pop()}
                            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        >
                            Sənədi yüklə
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}
