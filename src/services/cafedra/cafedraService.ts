import apiClient from "../../util/apiClient";

export interface Cafedra {
    faculty_code: string;
    cafedra_code: string;
    cafedra_name: string;
}

export interface CafedraResponse {
    cafedra_count: number;
    cafedras: Cafedra[];
}

export interface CafedraUser {
    fin_kod: string;
    name: string;
    surname: string;
    father_name: string;
    duty_code: string;
    duty_name: string;
    is_execution: boolean;
}

export interface CafedraUserResponse {
    statusCode: number;
    message: string;
    users: CafedraUser[];
}

export interface CafedraDetailsInterface {
    faculty_code: string;
    cafedra_code: string;
    cafedra_name: string;
    create_at: string;
}

export const createCafedra = async (
    faculty_code: string,
    cafedra_code: string,
    cafedra_name: string,
    token: string | null
) => {
    try {
        const response = await apiClient.post(
            `/api/add-cafedra`,
            null,
            {
                params: { faculty_code, cafedra_code, cafedra_name },
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};

export const updateCafedra = async (cafedra_code: string, cafedra_name: string, token: string | null) => {
    try {
        const response = await apiClient.put(
            `/api/update/cafedra/${cafedra_code}/${cafedra_name}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};

export const deleteCafedra = async (cafedra_code: string, token: string | null) => {
    try {
        const response = await apiClient.delete(
            `/api/delete/cafedra/${cafedra_code}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};

export const getAllCafedras = async (faculty_code: string, token: string | null) => {
    try {
        const response = await apiClient.get(`/api/cafedras/${faculty_code}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.statusCode === 200) {
            return response.data.cafedras as Cafedra[];
        }
        return [];
    } catch {
        return [];
    }
};

export const getCafedrasByFaculty = async (
    faculty_code: string,
    token: string
): Promise<CafedraResponse | "NOT FOUND"> => {
    const response = await apiClient.get(`/api/cafedras/${faculty_code}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (response.data.statusCode === 200) {
        return {
            cafedra_count: response.data.cafedra_count,
            cafedras: response.data.cafedras,
        };
    } else {
        return "NOT FOUND";
    }
};

export const getCafDetails = async (cafedra_code: string, token: string): Promise<CafedraDetailsInterface[] | string> => {
    const response = await apiClient.get(`/api/cafedra/${cafedra_code}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (response.data.statusCode === 200) {
        return response.data.cafedra;
    } else {
        return "NOT FOUND";
    }
};


export interface CafedraPlanHesabatItem {
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

export interface CafedraPlansHesabatsResponse {
    statusCode: number;
    cafedra_code: string;
    cafedra_name: string;
    faculty_code: string;
    faculty_name: string | null;
    items: CafedraPlanHesabatItem[];
}

export const getCafedraPlansHesabats = async (
    cafedra_code: string,
    token: string | null
): Promise<CafedraPlansHesabatsResponse | "NOT FOUND" | "ERROR"> => {
    try {
        const response = await apiClient.get(`/api/cafedra/${cafedra_code}/plans-hesabats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.statusCode === 200) {
            return response.data as CafedraPlansHesabatsResponse;
        } else if (response.data.statusCode === 404) {
            return "NOT FOUND";
        }
        return "ERROR";
    } catch {
        return "ERROR";
    }
};

export const getCafUsers = async (cafedra_code: string, start: number, end: number, token: string): Promise<CafedraUser[] | string | { users: CafedraUser[], total_users: number }> => {
    try {
        const response = await apiClient.get(`/api/cafedra/${cafedra_code}/users/${start}/${end}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.statusCode === 200) {
            return {
                "users": response.data.users,
                "total_users": response.data.total_users
            };
        } else if (response.data.statusCode === 404) {
            return "Cafedra code is not valid";
        } else if (response.status === 204) {
            return "No user";
        } else {
            return "Unexpected response";
        }
    } catch (error) {
        console.error("Error fetching cafedra users:", error);
        return "An error occurred while fetching users.";
    }
};