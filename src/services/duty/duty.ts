import apiClient from "../../util/apiClient";

export interface Duty {
    id: number;
    duty_code: number;
    duty_name: string;
    org_type?: "faculty" | "department";
    created_at: Date;
}

export type OrgType = "faculty" | "department";

export const getDutyByCode = async (duty_code: number, token: string) => {
    const response = await apiClient.get(`/api/duty/${duty_code}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (response.data.statusCode === 200) {
        return response.data.duty_name;
    } else if (response.data.statusCode === 404) {
        return "Not found";
    };
};

export const createDuty = async (
    duty_name: string,
    token: string | null,
    org_type: OrgType = "faculty"
) => {
    try {
        const response = await apiClient.post(
            `/api/add-duty`,
            null,
            {
                params: { duty_name, org_type },
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};

export const updateDuty = async (
    duty_code: number,
    duty_name: string,
    token: string | null,
    org_type?: OrgType
) => {
    try {
        const response = await apiClient.put(
            `/api/update/duty/${duty_code}/${duty_name}`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
                params: org_type ? { org_type } : undefined
            }
        );
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};

export const deleteDuty = async (duty_code: number, token: string | null) => {
    try {
        const response = await apiClient.delete(
            `/api/delete/duty/${duty_code}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};

export const getDuties = async (token: string | null, org_type?: OrgType) => {
    try {
        const response = await apiClient.get("/api/duties", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: org_type ? { org_type } : undefined
        });

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