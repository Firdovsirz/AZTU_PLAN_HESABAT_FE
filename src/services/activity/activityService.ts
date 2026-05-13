import apiClient from "../../util/apiClient";

export interface Activity {
    id: number;
    actvity_type_code: number;
    activity_type_name: string;
    created_at: string;
}

export interface CreatActivity {
    id: number;
    actvity_type_code: number;
    activity_type_name: string;
    created_at: string;
}

export const getActivities = async (fin_kod: string, token: string) => {
    try {
        const response = await apiClient.get(`/api/activities/${fin_kod}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.statusCode === 200) {
            return response.data.activities;
        } else if (response.data.statusCode === 204) {
            return "No acitivity";
        } else {
            return "error";
        }
    } catch (err) {
        return "error";
    }
}


export const createActivity = async (activity_type_name: string, fin_kod: string, token: string) => {
    try {
        const response = await apiClient.post(
            `/api/add-activity/${activity_type_name}/${fin_kod}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = response.data;

        if (data.statusCode === 201) {
            return {
                status: "SUCCESS",
                activity: {
                    id: data.id,
                    activity_type_code: data.activity_type_code,
                    activity_type_name: data.activity_type_name,
                    created_at: data.created_at
                }
            };
        } else if (data.statusCode === 409 && data.message === "Name already exist.") {
            return "ACTIVITY EXISTS";
        } else {
            return "error";
        }
    } catch (err) {
        return "error";
    }
};

export const getAllActivities = async (fin_kod: string, token: string | null) => {
    try {
        const response = await apiClient.get(`/api/activities/${fin_kod}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.statusCode === 200) {
            return response.data.activities as Activity[];
        }
        return [];
    } catch {
        return [];
    }
};

export const updateActivity = async (
    activity_code: number,
    activity_name: string,
    token: string | null
) => {
    try {
        const response = await apiClient.put(
            `/api/update/activity/${activity_code}/${activity_name}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};

export const deleteActivity = async (
    activity_code: number,
    token: string | null
) => {
    try {
        const response = await apiClient.delete(
            `/api/delete/activity/${activity_code}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};

export const getActivityByCode = async (activityTypeCode: number, token: string) => {
    try {
        const response = await apiClient.get(`/api/activity/${activityTypeCode}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.statusCode === 200) {
            return response.data.activity_name;
        } else if (response.data.statusCode === 404) {
            return "Not found"
        } else {
            return "ERROR";
        }
    } catch (err) {
        return "error";
    };
};