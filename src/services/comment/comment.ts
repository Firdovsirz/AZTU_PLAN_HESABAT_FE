import apiClient from "../../util/apiClient";

export type CommentTarget = "plan" | "hesabat" | "user";

export interface AppComment {
    id: number;
    author_fin_kod: string | null;
    owner_fin_kod: string;
    target_type: CommentTarget;
    target_ref: string;
    comment: string;
    created_at: string | null;
}

// Admin: add a comment to a plan/hesabat (item scope) or a user (all their
// plans & reports). target_ref is the serial number (plan/hesabat) or the
// user's fin_kod (user scope).
export const createComment = async (
    payload: { target_type: CommentTarget; target_ref: string; comment: string },
    token: string | null
) => {
    try {
        const response = await apiClient.post("/api/comments", payload, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};

// List comments for a target (owner or admin only). Returns [] on failure.
export const getComments = async (
    target_type: CommentTarget,
    target_ref: string,
    token: string | null
): Promise<AppComment[]> => {
    try {
        const response = await apiClient.get(
            `/api/comments/${target_type}/${encodeURIComponent(target_ref)}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data?.statusCode === 200) {
            return response.data.comments ?? [];
        }
        return [];
    } catch {
        return [];
    }
};

// Current user: all comments addressed to them (any target), newest first.
export const getMyComments = async (token: string | null): Promise<AppComment[]> => {
    try {
        const response = await apiClient.get("/api/my-comments", {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data?.statusCode === 200) {
            return response.data.comments ?? [];
        }
        return [];
    } catch {
        return [];
    }
};

// Admin: delete a comment.
export const deleteComment = async (id: number, token: string | null) => {
    try {
        const response = await apiClient.delete(`/api/comments/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};
