import apiClient from "../../util/apiClient";

export interface Duty {
    id: number;
    duty_code: number;
    duty_name: string;
    created_at: Date;
}

export const getDutyByCode = async (duty_code: number) => {
    const response = await apiClient.get(`/api/duty/${duty_code}`);

    if (response.data.statusCode === 200) {
        return response.data.duty_name;
    } else if (response.data.statusCode === 404) {
        return "Not found";
    };
};

export const getDuties = async () => {
    try {
        const response = await apiClient.get("/api/duties");

        if (response.data.statusCode === 200) {
            return response.data.duties;
        } else if (response.data.statusCode === 204) {
            return "NOT FOUND";
        } else {
            return "ERROR";
        };
    } catch (err) {
        return "ERROR";
    };
};