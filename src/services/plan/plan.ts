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

export const getPlanByFinKod = async (finKod: string, start: number, end: number) => {
    try {
        const response = await apiClient.get(`/api/plan/${finKod}/${start}/${end}`);

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

export const createPlan = async (formData: FormData) => {
    try {
        const response = await apiClient.post("/api/create-plan", formData);

        if (response.data.statusCode === 201) {
            return "SUCCESS";
        } else if (response.data.statusCode === 400) {
            return "Activity already in use";
        }
    } catch (err) {
        return "error";
    }
}