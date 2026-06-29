import apiClient from "../../util/apiClient";

export interface Faculty {
    id: number;
    faculty_name: string;
    faculty_code: string;
    cafedra_count: number;
    created_at: string;
}

export const getFaculties = async (token: string | null) => {
    const response = await apiClient.get("/api/faculties", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

    if (response.data.statusCode === 200) {
        return response.data.faculties;
    }
}

export const createFaculty = async (faculty_code: string, faculty_name: string, token: string | null) => {
    try {
        const response = await apiClient.post(
            `/api/add-faculty`,
            null,
            {
                params: { faculty_code, faculty_name },
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};

export const updateFaculty = async (faculty_code: string, faculty_name: string, token: string | null) => {
    try {
        const response = await apiClient.put(
            `/api/update/faculty/${faculty_code}/${faculty_name}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};

export const deleteFaculty = async (faculty_code: string, token: string | null) => {
    try {
        const response = await apiClient.delete(
            `/api/delete/faculty/${faculty_code}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};

export const getFacName = async (faculty_code: string, token: string | null) => {
    const response = await apiClient.get(`/api/faculties/${faculty_code}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

    if (response.data.statusCode === 200) {
        return response.data.faculty_name;
    }
}

export interface FacultyPlanHesabatItem {
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

export interface FacultyPlansHesabatsResponse {
    statusCode: number;
    faculty_code: string;
    faculty_name: string;
    items: FacultyPlanHesabatItem[];
}

// Plans/reports owned by the faculty itself (dekanat-level members).
export const getFacultyPlansHesabats = async (
    faculty_code: string,
    token: string | null
): Promise<FacultyPlansHesabatsResponse | "NOT FOUND" | "ERROR"> => {
    try {
        const response = await apiClient.get(`/api/faculty/${faculty_code}/plans-hesabats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.statusCode === 200) {
            return response.data as FacultyPlansHesabatsResponse;
        } else if (response.data.statusCode === 404) {
            return "NOT FOUND";
        }
        return "ERROR";
    } catch {
        return "ERROR";
    }
};