import apiClient from "../../util/apiClient";

export interface Hesabat {
    fin_kod: string;
    work_plan_serial_number: string;
    doc_name: string;
    activity_doc_path: File;
    done_percentage: number;
    assessment_score: number;
    admin_assessment: number;
    ai_assessment: string;
    submitted_at: string;
    activity_type_code: number;
    activity_type_name: string;
    duration_analysis: number;
    note: string;
    submitted: boolean;
}

export const getHesabatByFinKod = async (finKod: string, start: number, end: number) => {
    try {
        const response = await apiClient.get(`/api/hesabat/${finKod}/${start}/${end}`);

        if (response.data.statusCode === 200) {
            return {
                "hesabat_count": response.data.hesabat_count,
                "hesabats": response.data.hesabats
            };
        } else if (response.data.statusCode === 404) {
            return "Not found";
        } else {
            return "error";
        };
    } catch (err) {
        return "error";
    };
};

export const getHesabatBySerialNumber = async (serialNumber: string) => {
    try {
        const response = await apiClient.get(`/api/hesabat/plan/${serialNumber}`);
        if (response.data.statusCode === 200) {
            return response.data.hesabat;
        } else if (response.data.statusCode === 404) {
            return "Not found";
        } else {
            return "error";
        };
    } catch (err) {
        return "error";
    };
};

export const submitHesabat = async (formData: FormData) => {
    try {
        const response = await apiClient.post("/api/submit-hesabat", formData);

        if (response.data.statusCode === 200) {
            return "SUCCESS";
        } else if (response.data.statusCode === 404) {
            return "NOT FOUND";
        } else {
            return "ERROR";
        }
    } catch (err) {
        return "ERROR";
    };
};