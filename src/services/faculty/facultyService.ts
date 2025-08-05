import apiClient from "../../util/apiClient";

export interface Faculty {
    id: number;
    faculty_name: string;
    faculty_code: string;
    cafedra_count: number;
    created_at: string;
}

export const getFaculties = async () => {
    const response = await apiClient.get("/api/faculties");

    if (response.data.statusCode === 200) {
        return response.data.faculties;
    }
}

export const getFacName = async (faculty_code: string) => {
    const response = await apiClient.get(`/api/faculties/${faculty_code}`);

    if (response.data.statusCode === 200) {
        return response.data.faculty_name;
    }
}