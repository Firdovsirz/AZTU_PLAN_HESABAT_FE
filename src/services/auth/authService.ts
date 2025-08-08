import apiClient from "../../util/apiClient";

export interface Credentials {
    fin_kod: string;
    password: string;
}

// sign in with fin kod and password

export const signin = async (credentials: Credentials) => {
    try {
        const resposne = await apiClient.post("/auth/signin", credentials);

        if (resposne.data.statusCode === 200) {
            return resposne.data;
        } else if (resposne.data.statusCode === 401) {
            return "UNAUTHORIZED";
        } else {
            return "UNAUTHORIZED";
        }
    } catch (err) {
        return "error";
    };
};

// signup with form data

export const signup = async (formData: FormData) => {
    try {
        const response = await apiClient.post("/auth/signup", formData);

        if (response.data.statusCode === 201) {
            return "SUCCESS";
        } else if (response.data.statusCode === 400) {
            return "CONFLICT";
        } else {
            return "ERROR";
        }
    } catch (err) {
        return "ERROR";
    };
};

// set a new password

export const resetPassword = async (password: string, token: string) => {
    try {
        const response = await apiClient.post("/auth/reset-password", {
            password,
            token,
        });

        if (response.data.statusCode === 200) {
            return "SUCCESS";
        } else if (response.data.statusCode === 400) {
            return "BAD REQUEST";
        } else if (response.status === 401) {
            return "UNAUTHORIZED";
        } else {
            return "ERROR";
        }
    } catch (error) {
        return { statusCode: 500, message: "Error resetting password." };
    }
};