import apiClient from "../../util/apiClient";

export interface Plan {
    fin_kod: string;
    work_plan_serial_number: string;
    work_year: string;
    work_row_number: number;
    activity_type_names: string[];
    work_desc: string;
    goal?: string | null;
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
    activity_type_codes: string[];
    activity_type_names: string[];
    deadline: string;
    goal?: string | null;
    created_at: string;
}

export interface SinglePlan {
    work_plan_serial_number: string;
    work_year: number;
    work_desc: string;
    goal?: string | null;
    deadline: string;
    activities: string[];
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
                "total_plans": response.data.total_plans,
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

// get single plan by serial number

export const getPlanBySerialNumber = async (work_plan_serial_number: string, token: string) => {
    try {
        const response = await apiClient.get(`/api/single-plan/${work_plan_serial_number}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const statusCode = response.data.statusCode;

        if (statusCode === 200) {
            return {
                'fin_kod': response.data.fin_kod,
                'work_plan_serial_number': response.data.work_plan_serial_number,
                'work_year': response.data.work_year,
                'work_desc': response.data.work_desc,
                'goal': response.data.goal,
                'deadline': response.data.deadline,
                'activities': response.data.activities
            }
        } else if (statusCode === 404) {
            return "NOT FOUND";
        } else {
            return "ERROR";
        }
    } catch (err) {
        return "ERROR";
    }
}

// update plan (add activity types to the plan)

export const updatePlan = async (
    work_plan_serial_number: string,
    activity_type_codes: string[],
    activity_type_names: string[] | null,
    token: string
) => {
    try {
        const response = await apiClient.post("/api/update/plan", {
            work_plan_serial_number,
            activity_type_codes,
            activity_type_names
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.statusCode === 201) {
            return "SUCCESS";
        } else if (response.data.statusCode === 404) {
            return "PLAN NOT FOUND";
        } else if (response.data.statusCode === 409) {
            return "CONFLICT";
        } else {
            return "ERROR";
        }
    } catch (err) {
        return "ERROR";
    }
}

// Editable scalar fields for a plan (used by both the request flow and the
// admin direct-edit flow).
export interface PlanEditChanges {
    work_year?: number | string;
    work_desc?: string;
    goal?: string | null;
    deadline?: string | null;
}

// Admin: directly edit a plan's scalar fields. The owner is notified server-side.
export const adminEditPlan = async (
    work_plan_serial_number: string,
    changes: PlanEditChanges,
    token: string | null
) => {
    try {
        const response = await apiClient.patch(
            `/api/plan/${work_plan_serial_number}/edit`,
            { changes },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};

// Admin: directly delete a plan (and its hesabats). The owner is notified.
export const adminDeletePlan = async (
    work_plan_serial_number: string,
    token: string | null
) => {
    try {
        const response = await apiClient.delete(
            `/api/plan/${work_plan_serial_number}/delete`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};