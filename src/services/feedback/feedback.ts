import apiClient from "../../util/apiClient";

export interface YouSaidWeDid {
    id: number;
    you_said_az: string;
    you_said_en: string;
    we_did_az: string;
    we_did_en: string;
    created_at: string | null;
    updated_at: string | null;
}

export interface YouSaidWeDidPayload {
    you_said_az: string;
    you_said_en: string;
    we_did_az: string;
    we_did_en: string;
}

// Public: list all "you said / we did" entries (used on the landing page).
export const getYouSaidWeDid = async (): Promise<YouSaidWeDid[]> => {
    try {
        const response = await apiClient.get("/api/you-said-we-did");
        if (response.data?.statusCode === 200) {
            return response.data.items ?? [];
        }
        return [];
    } catch {
        return [];
    }
};

// Admin: create an entry (both languages required).
export const createYouSaidWeDid = async (
    payload: YouSaidWeDidPayload,
    token: string | null
) => {
    try {
        const response = await apiClient.post(
            "/api/you-said-we-did",
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};

// Admin: update an entry.
export const updateYouSaidWeDid = async (
    id: number,
    payload: Partial<YouSaidWeDidPayload>,
    token: string | null
) => {
    try {
        const response = await apiClient.put(
            `/api/you-said-we-did/${id}`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};

// Admin: delete an entry.
export const deleteYouSaidWeDid = async (id: number, token: string | null) => {
    try {
        const response = await apiClient.delete(`/api/you-said-we-did/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};
