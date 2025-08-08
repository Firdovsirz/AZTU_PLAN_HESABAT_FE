import apiClient from "../../util/apiClient";

// send otp using fin kod

export const sendOtp = async (finKod: string) => {
    try {
        const response = await apiClient.post(`/auth/send-otp/${finKod}`);

        if (response.data.statusCode === 200) {
            return "SUCCESS";
        } else if (response.data.statusCode === 404) {
            return "NOT FOUND";
        } else {
            return "ERROR";
        }
    } catch (err) {
        return "ERROR";
    };
};

// validate otp with otp code and fin kod

export const validateOTP = async (finKod: string, otp: number) => {
    try {
        const response = await apiClient.post(`auth/validate-otp/${finKod}/${otp}`);

        if (response.data.statusCode === 200) {
            return response.data.token;
        } else if (response.data.statusCode === 401) {
            return "UNAUTHORIZED";
        } else {
            return "ERROR";
        }
    } catch (err) {
        return "ERROR";
    };
};