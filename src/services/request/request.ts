import apiClient from "../../util/apiClient";

export type RequestType = "edit" | "delete";
export type RequestTarget = "plan" | "hesabat";
export type RequestStatus = "pending" | "approved" | "rejected";

export interface UserRequest {
    id: number;
    fin_kod: string;
    requester_name: string | null;
    request_type: RequestType;
    request_text: string;
    target_type: RequestTarget | null;
    target_serial: string | null;
    proposed_changes: Record<string, unknown> | null;
    status: RequestStatus;
    reject_note: string | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface CreateRequestPayload {
    request_type: RequestType;
    request_text: string;
    target_type: RequestTarget;
    target_serial: string;
    // Required for edit requests; omitted/ignored for delete.
    proposed_changes?: Record<string, unknown> | null;
}

// Non-admin: submit an edit/delete request for a concrete plan/hesabat.
export const createRequest = async (
    payload: CreateRequestPayload,
    token: string | null
) => {
    try {
        const response = await apiClient.post(
            "/api/create-request",
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};

// Non-admin: list the current user's own requests.
export const getMyRequests = async (token: string | null): Promise<UserRequest[]> => {
    try {
        const response = await apiClient.get("/api/my-requests", {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data?.statusCode === 200) {
            return response.data.requests ?? [];
        }
        return [];
    } catch {
        return [];
    }
};

// Admin: list all requests.
export const getAllRequests = async (token: string | null): Promise<UserRequest[]> => {
    try {
        const response = await apiClient.get("/api/requests", {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data?.statusCode === 200) {
            return response.data.requests ?? [];
        }
        return [];
    } catch {
        return [];
    }
};

// Admin: edit a request's text / type / status.
export const updateRequest = async (
    request_id: number,
    payload: { request_type?: RequestType; request_text?: string; status?: RequestStatus },
    token: string | null
) => {
    try {
        const response = await apiClient.put(
            `/api/update/request/${request_id}`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};

// Admin: approve a request.
export const approveRequest = async (request_id: number, token: string | null) => {
    try {
        const response = await apiClient.patch(
            `/api/approve/request/${request_id}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};

// Admin: reject a request with a note shown back to the user.
export const rejectRequest = async (
    request_id: number,
    reject_note: string,
    token: string | null
) => {
    try {
        const response = await apiClient.patch(
            `/api/reject/request/${request_id}`,
            { reject_note },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};

// Admin: delete a request record.
export const deleteRequest = async (request_id: number, token: string | null) => {
    try {
        const response = await apiClient.delete(`/api/delete/request/${request_id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};
