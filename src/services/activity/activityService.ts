import apiClient from "../../util/apiClient";

export interface Activity {
    id: number;
    actvity_type_code: number;
    activity_type_name: string;
    created_at: string;
}

export const getActivities = async () => {
    try {
        const response = await apiClient.get("/api/activities");

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


export const createActivity = async (activity_type_name: string) => {
    try {
        const response = await apiClient.post(`/api/add-activity/${activity_type_name}`);

        if (response.data.statusCode === 201) {
            return "SUCCESS";
        } else if (response.data.statusCode === 400) {
            return "ACTIVITY EXISTS"
        } else {
            return "error";
        }
    } catch (err) {
        return "error";
    }
}

export const getActivityByCode = async (activityTypeCode: number) => {
    try {
        const response = await apiClient.get(`/api/activity/${activityTypeCode}`);

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