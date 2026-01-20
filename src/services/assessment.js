const API_URL = process.env.REACT_APP_API_URL || "http://16.16.141.229:8000";

const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        console.warn("No access token found in localStorage");
    }
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

export const assessmentService = {
    // Start or resume assessment
    startAssessment: async (packVersion = "v1") => {
        try {
            const response = await fetch(`${API_URL}/api/auth/assessment/start/`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({ pack_version: packVersion }),
            });

            if (response.status === 409) {
                // Assessment already exists/in-progress. 
                // Typically returns the existing run info.
                const data = await response.json();
                console.warn("Assessment already started (409), resuming:", data);
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
            return response.json();
        } catch (error) {
            console.error("StartAssessment Exception:", error);
            throw error;
        }
    },

    // Get next unanswered question
    getNextQuestion: async (runId) => {
        const response = await fetch(`${API_URL}/api/auth/assessment/${runId}/next/`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            // If 404 or similar, it might mean no more questions
            if (response.status === 404) return null;
            throw new Error("Failed to fetch next question");
        }
        return response.json();
    },

    // Submit answer
    submitAnswer: async (runId, questionId, choice) => {
        const payload = { question_id: questionId, choice };
        console.log("Submitting Answer Payload:", payload); // Debug log

        const response = await fetch(`${API_URL}/api/auth/assessment/${runId}/answer/`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Submit Answer Error:", response.status, errorText);
            throw new Error(`Failed to submit answer: ${response.status} ${errorText}`);
        }
        return response.json();
    },

    // Get assessment progress
    getProgress: async (runId) => {
        const response = await fetch(`${API_URL}/api/auth/assessment/${runId}/progress/`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to get progress");
        return response.json();
    },

    // Get results
    getResults: async (runId) => {
        const response = await fetch(`${API_URL}/api/auth/assessment/${runId}/results/`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            const text = await response.text();
            console.error("Get Results Error:", response.status, text);
            throw new Error(`Failed to get results: ${response.status} ${text}`);
        }
        return response.json();
    },

    // Generate diagnostic brief
    generateBrief: async (runId) => {
        const response = await fetch(`${API_URL}/api/auth/assessment/${runId}/generate-brief/`, {
            method: "POST",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to generate brief");
        return response.json();
    },
};
