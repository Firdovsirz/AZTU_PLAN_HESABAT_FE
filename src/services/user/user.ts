import apiClient from "../../util/apiClient";

export enum ResponseStatus {
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
    NO_CONTENT = "NO CONTENT",
    NOT_FOUND = "NOT FOUND"
}

export interface AllUser {
    name: string;
    surname: string;
    father_name: string;
    fin_kod: string;
    email: string;
    faculty_code: string | null;
    duty_name: string;
    created_at: string;
    updated_at: string | null;
    is_execution: string;
}

export interface User {
    fin_kod: string;
    email: string;
    name: string;
    surname: string;
    father_name: string;
    faculty_code: string;
    faculty_name: string;
    cafedra_code: string;
    duty_code: number;
    is_execution: boolean;
    created_at: string;
    updated_at?: string;
}

export interface AppWaitingUser {
    fin_kod: string;
    email: string;
    name: string;
    surname: string;
    father_name: string;
    faculty_code: string;
    faculty_name: string;
    cafedra_code: string;
    duty_code: number;
    is_execution: boolean;
    created_at: string;
    updated_at?: string;
}

// Get all dekans

export const getDekans = async (start: number, end: number) => {
    try {
        const response = await apiClient.get(`/api/dekans/${start}/${end}`);

        if (response.data.statusCode === 200 ) {
            return {
                "dekans": response.data.dekans,
                "total_dekans": response.data.total_dekans
            }
        } else if (response.data.statusCode === 204){
            return "NO CONTENT";
        } else {
            return "ERROR";
        };
    } catch (err) {
        return "ERROR";
    }
}

// Get cafedra directors

export const getCafDirectors = async (start: number, end: number) => {
    try {
        const response = await apiClient.get(`/api/caf-directors/${start}/${end}`);

        if (response.data.statusCode === 200 ) {
            return {
                "caf_directors": response.data.caf_directors,
                "total_caf_directors": response.data.total_caf_directors
            }
        } else if (response.data.statusCode === 204){
            return "NO CONTENT";
        } else {
            return "ERROR";
        };
    } catch (err) {
        return "ERROR";
    }
}

// Get all users by pagination indexes (start, end)

export const getAllUsers = async (start: number, end: number) => {
    try {
        const response = await apiClient(`/api/users/${start}/${end}`);

        if (response.data.statusCode === 200) {
            return {
                "users": response.data.users,
                "total_users": response.data.total_users
            };
        } else if (response.data.statusCode === 204) {
            return "NO CONTENT";
        } else {
            return "ERROR";
        }
    } catch (err) {
        return "ERROR";
    }
}

// Get user by fin kod

export const getUserByFinKod = async (finKod: string) => {
    const response = await apiClient.get(`/api/user/${finKod}`);

    if (response.data.statusCode === 200) {
        return response.data.user;
    } else if (response.data.statusCode === 404) {
        return "Not found";
    };
};

// Get execution users

export const getExecutionUsers = async (start: number, end: number) => {
    const response = await apiClient.get(`/api/users/execution/${start}/${end}`);

    if (response.status === 204) {
        return "No user found."
    } else {
        return {
            user_count: response.data.user_count,
            users: response.data.users
        };
    }
};

// Get all approve waiting users only visible by admin

export const getApproveWaitingUsers = async (): Promise<AppWaitingUser[] | ResponseStatus> => {
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