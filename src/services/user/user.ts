import apiClient from "../../util/apiClient";

export enum ResponseStatus {
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
    NO_CONTENT = "NO CONTENT",
    NOT_FOUND = "NOT FOUND"
}

export interface User {
    fin_kod: string;
    email: string;
    name: string;
    surname: string;
    father_name: string;
    faculty_code: string;
    cafedra_code: string;
    duty_code: number;
    is_execution: boolean;
    created_at: string;
    updated_at?: string;
}

export const getUserByFinKod = async (finKod: string) => {
    const response = await apiClient.get(`/api/user/${finKod}`);

    if (response.data.statusCode === 200) {
        return response.data.user;
    } else if (response.data.statusCode === 404) {
        return "Not found";
    };
};

export const getExecutionUsers = async () => {
    const response = await apiClient.get("/api/users/execution");

    if (response.status === 204) {
        return "No user found."
    } else {
        return response.data.users;
    };
};

export const getApproveWaitingUsers = async (): Promise<User[] | ResponseStatus> => {
    try {
        const response = await apiClient.get("/auth/app-wait-users");

        const status = response.data.status;

        if (status === 200) {
            return response.data.users;
        } else if (status === 204) {
            return ResponseStatus.NO_CONTENT;
        } else {
            return ResponseStatus.ERROR;
        }
    } catch (error) {
        return ResponseStatus.ERROR;
    }
};

// Approve requested user by fin code only for super admin role

export const approveUser = async (finKod: string): Promise<ResponseStatus> => {
    try {
        const response = await apiClient.post(`/auth/approve-user/${finKod}`);

        const status = response.data.status;

        if (status === 200) {
            return ResponseStatus.SUCCESS;
        } else if (status === 400) {
            return ResponseStatus.NOT_FOUND
        } else {
            return ResponseStatus.ERROR;
        }
    } catch (error) {
        return ResponseStatus.ERROR;
    };
};

// Reject requested user by fin code only for super admin role

export const rejectUser = async (finKod: string): Promise<ResponseStatus> => {
    try {
        const response = await apiClient.delete(`/auth/reject-user/${finKod}`);

        const status = response.data.status;

        if (status === 200) {
            return ResponseStatus.SUCCESS;
        } else if (status === 404) {
            return ResponseStatus.NOT_FOUND;
        } else {
            return ResponseStatus.ERROR;
        }
    } catch (error) {
        return ResponseStatus.ERROR;
    }
}