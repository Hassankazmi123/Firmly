import { authenticatedFetch, API_URL } from "./api";

const extractRunId = (payload) =>
    payload?.id || payload?.run_id || payload?.assessment_id || payload?.assessmentId;

export const assessmentService = {
    // Start or resume assessment
    startAssessment: async (packVersion = "v1") => {
        try {
            const response = await authenticatedFetch(`${API_URL}/api/auth/assessment/start/`, {
                method: "POST",
                body: JSON.stringify({ pack_version: packVersion }),
                returnRawResponse: true,
            });

            if (response.status === 409) {
                const data = await response.json();
                console.warn("Assessment already started (409), resuming:", data);
                const runId = extractRunId(data);
                if (runId) {
                    localStorage.setItem("assessmentId", String(runId));
                }
                return data;
            }

            if (!response.ok) {
                const text = await response.text();
                console.error("Start Assessment Error:", response.status, text);
                if (response.status === 401) {
                    throw new Error("Unauthorized: Please log in again.");
                }
                throw new Error(`Failed to start assessment: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            const runId = extractRunId(data);
            if (runId) {
                localStorage.setItem("assessmentId", String(runId));
            }
            return data;
        } catch (error) {
            console.error("StartAssessment Exception:", error);
            throw error;
        }
    },

    // Get next unanswered question
    getNextQuestion: async (runId) => {
        const response = await authenticatedFetch(`${API_URL}/api/auth/assessment/${runId}/next/`, {
            method: "GET",
            returnRawResponse: true,
        });

        if (response.status === 204) {
            return null;
        }

        if (!response.ok) {
            if (response.status === 404 || response.status === 410) return null;
            throw new Error("Failed to fetch next question");
        }
        return response.json();
    },

    // Submit answer
    submitAnswer: async (runId, questionId, choice) => {
        const payload = { question_id: questionId, choice };
        console.log("Submitting Answer Payload:", payload);

        return await authenticatedFetch(`${API_URL}/api/auth/assessment/${runId}/answer/`, {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    // Get assessment progress
    getProgress: async (runId) => {
        return await authenticatedFetch(`${API_URL}/api/auth/assessment/${runId}/progress/`, {
            method: "GET",
        });
    },

    // Get results
    getResults: async (runId) => {
        return await authenticatedFetch(`${API_URL}/api/auth/assessment/${runId}/results/`, {
            method: "GET",
        });
    },

    // Generate diagnostic brief
    generateBrief: async (runId) => {
        return await authenticatedFetch(`${API_URL}/api/auth/assessment/${runId}/generate-brief/`, {
            method: "POST",
        });
    },
};