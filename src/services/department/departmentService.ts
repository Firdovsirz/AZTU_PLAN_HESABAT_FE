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
