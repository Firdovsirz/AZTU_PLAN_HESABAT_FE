import apiClient from "../../util/apiClient";

export interface Plan {
    fin_kod: string;
    work_plan_serial_number: string;
    work_year: string;
    work_row_number: number;
    activity_type_code: number;
    work_desc: string;
    deadline: string;
}

export interface AllPlan {
    name: string;
    surname: string;
    father_name: string;
    fin_kod: string;
    is_submitted: boolean;
    work_plan_serial_number: string;
    work_year: string;
    work_row_number: number;
    activity_type_code: number;
    deadline: string;
    created_at: string;
}

// Get all plans

export const getPlans = async (start: number, end: number, token: string): Promise<string | { plans: AllPlan, total_plans: number }> => {
    try {
        const response = await apiClient.get(`/api/plans/${start}/${end}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.statusCode === 200) {
            return {
                "plans": response.data.plans,
                "total_plans": response.data.total_plans
            }
        } else if (response.data.statusCode === 204) {
            return "NO CONTENT";
        } else {
            return "ERROR";
        }
    } catch (err) {
        return "ERROR";
    }
}

export const getPlanByFinKod = async (finKod: string, start: number, end: number, token: string) => {
    try {
        const response = await apiClient.get(`/api/plan/${finKod}/${start}/${end}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.statusCode === 200) {
            return {
                "plan_count": response.data.plan_count,
                "plans": response.data.plan
            };
        } else if (response.data.statusCode === 404) {
            return "Not found";
        } else {
            return "error";
        }
    } catch (error) {
        console.error("API call failed:", error);
        return "error";
    }
};

export const createPlan = async (formData: FormData, token: string) => {
    try {
        const response = await apiClient.post("/api/create-plan", formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.statusCode === 201) {
            return "SUCCESS";
        } else if (response.data.statusCode === 400) {
            return "Activity already in use";
        }
    } catch (err) {
        return "error";
    }
}