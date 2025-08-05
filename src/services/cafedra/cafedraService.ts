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
    is_execution: boolean
}

export interface CafedraUserResponse {
    statusCode: number;
    message: string;
    users: CafedraUser[];
}

export const getCafedrasByFaculty = async (
    faculty_code: string
): Promise<CafedraResponse | "NOT FOUND"> => {
    const response = await apiClient.get(`/api/cafedras/${faculty_code}`);

    if (response.data.statusCode === 200) {
        return {
            cafedra_count: response.data.cafedra_count,
            cafedras: response.data.cafedras,
        };
    } else {
        return "NOT FOUND";
    }
};


export const getCafName = async (cafedra_code: string) => {
    const response = await apiClient.get(`/api/cafedra/${cafedra_code}`);

    if (response.data.statusCode === 200) {
        return response.data.cafedra_name
    } else {
        return "NOT FOUND";
    }
};

export const getCafUsers = async (cafedra_code: string): Promise<CafedraUser[] | string> => {
    try {
        const response = await apiClient.get(`/api/cafedra/${cafedra_code}/users`);

        if (response.data.statusCode === 200) {
            return response.data.users;
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