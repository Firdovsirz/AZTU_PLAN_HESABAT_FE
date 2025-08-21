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