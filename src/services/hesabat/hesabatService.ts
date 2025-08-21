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

export interface SubmittedHesabatsInterface {
    name: string;
    surname: string;
    father_name: string;
    fin_kod: string;
    work_year: number;
    plan_work_serial_number: string;
    activity_type_name: string;
    activity_doc_path: string;
    done_percentage: string;
    assessment_score: number;
    admin_assessment: number | null,
    activity_type_code: number;
    ai_assessment: number;
    submitted_at: string;
    duration_analysis: number,
    note: string;
    submitted: boolean;
    done: boolean;
}

interface UpdateAssessmentRequest {
    work_plan_serial_number: string;
    admin_assessment_score: number;
}

export interface ArchiveInterface {
    fin_kod: string;
    name: string;
    surname: string;
    father_name: string;
    work_plan_serial_number: string;
    assessment_score: number;
    done_percentage: string;
    admin_assessment: number;
    ai_assessment: number;
    activity_type_name: string;
}

// Get all submitted hesabats by pagination

export const getSubmittedHesabats = async (start: number, end: number, token: string): Promise<string | { hesabats: SubmittedHesabatsInterface[], total_hesabats: number }> => {
    try {
        const response = await apiClient(`/api/submitted-hesabats/${start}/${end}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.statusCode === 200) {
            return {
                "hesabats": response.data.hesabats,
                "total_hesabats": response.data.total_hesabats
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

// Get single hesabat by fin kod

export const getHesabatByFinKod = async (finKod: string, start: number, end: number, token: string) => {
    try {
        const response = await apiClient.get(`/api/hesabat/${finKod}/${start}/${end}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

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

// Get single hesabat by serial number

export const getHesabatBySerialNumber = async (serialNumber: string, token: string) => {
    try {
        const response = await apiClient.get(`/api/hesabat/plan/${serialNumber}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
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

// Submit hesabat

export const submitHesabat = async (formData: FormData, token: string) => {
    try {
        const response = await apiClient.post("/api/submit-hesabat", formData, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            validateStatus: () => true  // <-- allow all status codes to reach "then"
        });

        if (response.data.statusCode === 200) {
            return "SUCCESS";
        } else if (response.data.statusCode === 404) {
            return "NOT FOUND";
        } else if (response.data.statusCode === 400) {
            return "BAD REQUEST";
        } else {
            return "ERROR";
        }
    } catch (err) {
        return "ERROR";
    }
};

// Done hesabat

export const doneHesabat = async (work_plan_serial_number: string, token: string) => {
    try {
        const response = await apiClient.post(`/api/done-hesabat/${work_plan_serial_number}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            validateStatus: () => true
        });

        const statusCode = response.data.statusCode;

        if (statusCode === 200) {
            return "SUCCESS";
        } else if (statusCode === 404) {
            return "NOT FOUND";
        } else if (statusCode === 400) {
            return "BAD REQUEST";
        } else {
            return "ERROR";
        }
    } catch (e) {
        return "ERROR";
    }
}

// Add admin assessment score to the hesabat

export const addAssessment = async (assessment_data: { work_plan_serial_number: string, admin_assessment_score: number }, token: string) => {
    try {
        const response = await apiClient.post("/api/assessment", assessment_data, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            validateStatus: () => true
        });

        if (response.data.statusCode === 200) {
            return "SUCCESS";
        } else if (response.data.statusCode === 409) {
            return "CONFLICT";
        } else if (response.data.statusCode === 400) {
            return "BAD REQUEST";
        } else if (response.data.statusCode === 500) {
            return "ERROR";
        }
    } catch (err) {
        return "ERROR";
    }
}

// Update admin assessment

export const updateAssessment = async (assessment_data: UpdateAssessmentRequest, token: string) => {
    try {
        const response = await apiClient.patch("/api/assessment/update", assessment_data, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            validateStatus: () => true
        });

        const statusCode = response.data.statusCode;

        switch (statusCode) {
            case 200:
                return "SUCCESS";
            case 400:
                return "BAD REQUEST";
            default:
                return "ERROR";
        }
    } catch (e) {
        return "ERROR";
    }
}

// Get archive

export const getArchive = async (start: number, end: number, token: string) => {
    try {
        const response = await apiClient.get(`/api/archive/${start}/${end}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            validateStatus: () => true
        });

        const statusCode = response.data.statusCode;

        if (statusCode === 200) {
            return {
                "archive": response.data.archive,
                "hesabat_count": response.data.total_hesabats
            }
        } else if (response.status === 204) {
            return "NO CONTENT";
        } else {
            return "ERROR";
        }
    } catch (e) {
        return "ERROR";
    }
}