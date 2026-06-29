import apiClient from "../../util/apiClient";

export interface YouSaidWeDid {
    id: number;
    you_said: string;
    we_did: string;
    created_at: string | null;
    updated_at: string | null;
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

// Admin: create an entry.
export const createYouSaidWeDid = async (
    you_said: string,
    we_did: string,
    token: string | null
) => {
    try {
        const response = await apiClient.post(
            "/api/you-said-we-did",
            { you_said, we_did },
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
    payload: { you_said?: string; we_did?: string },
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
