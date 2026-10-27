import { isAxiosError } from "axios";
import apiClient from "../../util/apiClient";

export type ExportFormat = "pdf" | "xlsx";
export type ExportContent = "plans" | "reports" | "all";
export type ExportScope = "faculty" | "cafedra" | "department";

export interface StructureExportParams {
    scope: ExportScope;
    code: string;
    content: ExportContent;
    format: ExportFormat;
    year?: number | null;
    // Faculty scope only: also export the faculty's kafedras.
    include_cafedras?: boolean;
}

export type ExportResult = { ok: true } | { ok: false; message: string };

// Pull the server-chosen name out of `attachment; filename="..."`.
const fileNameFrom = (header: string | undefined, fallback: string) => {
    const match = header?.match(/filename="?([^";]+)"?/i);
    return match ? match[1] : fallback;
};

const saveBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Give the browser a moment to start the download before releasing it.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// The request asks for a Blob, so error bodies arrive as Blobs too.
const errorMessage = async (err: unknown): Promise<string> => {
    const status = isAxiosError(err) ? err.response?.status : undefined;
    if (status === 403) return "Bu ixrac üçün icazəniz yoxdur";
    if (status === 429) return "Çox sayda sorğu göndərildi, bir az sonra yenidən cəhd edin";
    const data = isAxiosError(err) ? err.response?.data : undefined;
    if (status === 404 && data instanceof Blob) {
        try {
            const body = JSON.parse(await data.text());
            if (body?.message) return body.message;
        } catch {
            // Not JSON; fall through to the generic message.
        }
    }
    return "Fayl hazırlanarkən xəta baş verdi";
};

const download = async (
    url: string,
    params: Record<string, string | number | boolean>,
    token: string | null,
    fallbackName: string
): Promise<ExportResult> => {
    try {
        const response = await apiClient.get(url, {
            params,
            responseType: "blob",
            headers: { Authorization: `Bearer ${token}` }
        });
        saveBlob(response.data, fileNameFrom(response.headers["content-disposition"], fallbackName));
        return { ok: true };
    } catch (err) {
        return { ok: false, message: await errorMessage(err) };
    }
};

// Any role: export the signed-in user's own plans/reports.
export const exportMyDocuments = (
    content: ExportContent,
    format: ExportFormat,
    token: string | null
) => download("/api/export/my", { content, format }, token, `AzTU_${content}.${format}`);

// Admin: export a whole faculty, kafedra or department.
export const exportStructure = (params: StructureExportParams, token: string | null) => {
    const { year, include_cafedras, ...rest } = params;
    return download(
        "/api/export/structure",
        {
            ...rest,
            ...(year ? { year } : {}),
            ...(include_cafedras !== undefined ? { include_cafedras } : {})
        },
        token,
        `AzTU_${params.scope}_${params.code}.${params.format}`
    );
};
