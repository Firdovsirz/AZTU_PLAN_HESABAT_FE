import apiClient from "../../util/apiClient";

export interface Department {
    id: number;
    department_code: string;
    department_name: string;
    created_at: string | null;
    updated_at: string | null;
}

export const getDepartments = async (token: string | null): Promise<Department[]> => {
    try {
        const response = await apiClient.get("/api/departments", {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.statusCode === 200) {
            return response.data.departments;
        }
        return [];
    } catch {
        return [];
    }
};

export interface DepartmentPlanHesabatItem {
    fin_kod: string;
    name: string | null;
    surname: string | null;
    father_name: string | null;
    work_plan_serial_number: string;
    work_year: number;
    work_row_number: number;
    work_desc: string | null;
    deadline: string | null;
    created_at: string | null;
    activity_type_codes: (string | number)[];
    activity_type_names: (string | null)[];
    is_submitted: boolean;
    is_done: boolean;
    admin_assessment: number | null;
    ai_assessment: number | null;
    done_percentage: string | null;
}

export interface DepartmentPlansHesabatsResponse {
    statusCode: number;
    department_code: string;
    department_name: string;
    items: DepartmentPlanHesabatItem[];
}

export const getDepartmentPlansHesabats = async (
    department_code: string,
    token: string | null
): Promise<DepartmentPlansHesabatsResponse | "NOT FOUND" | "ERROR"> => {
    try {
        const response = await apiClient.get(`/api/department/${department_code}/plans-hesabats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.statusCode === 200) {
            return response.data as DepartmentPlansHesabatsResponse;
        } else if (response.data.statusCode === 404) {
            return "NOT FOUND";
        }
        return "ERROR";
    } catch {
        return "ERROR";
    }
};

export const createDepartment = async (
    department_code: string,
    department_name: string,
    token: string | null
) => {
    try {
        const response = await apiClient.post(
            `/api/add-department/${department_code}/${department_name}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};

export const updateDepartment = async (
    department_code: string,
    department_name: string,
    token: string | null
) => {
    try {
        const response = await apiClient.put(
            `/api/update/department/${department_code}/${department_name}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};

export const deleteDepartment = async (
    department_code: string,
    token: string | null
) => {
    try {
        const response = await apiClient.delete(
            `/api/delete/department/${department_code}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};
