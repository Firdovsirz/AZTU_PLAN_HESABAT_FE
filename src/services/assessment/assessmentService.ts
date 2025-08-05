import apiClient from "../../util/apiClient";

export interface Assessment {
    assessment_score: number;
    score_name: string;
    score_desc: string;
}

export const getAssessments = async () => {
    try {
        const response = await apiClient.get("/api/assessments");

        if (response.data.statusCode === 200) {
            return response.data.assessments;
        } else if (response.data.statusCode === 204) {
            return "No assessment";
        } else {
            return "error"
        }
    } catch (err) {
        return "error";
    }
}