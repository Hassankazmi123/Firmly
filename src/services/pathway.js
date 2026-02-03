const API_BASE_URL = process.env.REACT_APP_API_URL || "http://16.16.141.229:8000";
const API_AUTH_URL = `${API_BASE_URL}/api/auth`;
const API_PATHWAY_URL = `${API_BASE_URL}/api/pathway`;

const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        console.warn("No access token found in localStorage (pathway service)");
    }
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
        throw new Error("No refresh token available");
    }

    try {
        console.log("Attempting to refresh token (pathway service)...");
        let response = await fetch(`${API_AUTH_URL}/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: refreshToken })
        });

        if (response.status === 404) {
            response = await fetch(`${API_AUTH_URL}/refresh/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh: refreshToken })
            });
        }

        if (!response.ok) {
            throw new Error("Refresh failed");
        }

        const data = await response.json();
        const newAccess = data.access || data.access_token || data.token || data.key || (data.tokens && (data.tokens.access || data.tokens.access_token));

        if (newAccess) {
            console.log("Token refreshed successfully (pathway service)");
            localStorage.setItem("accessToken", newAccess);
            return newAccess;
        }
        throw new Error("No token in response");
    } catch (error) {
        console.error("Token refresh failed (pathway service):", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        throw error;
    }
};

const authenticatedFetch = async (url, options = {}) => {
    let headers = getAuthHeaders();
    try {
        let response = await fetch(url, {
            ...options,
            headers: { ...headers, ...options.headers }
        });

        if (response.status === 401) {
            console.warn("401 in pathway service, attempting refresh...");
            try {
                const newToken = await refreshAccessToken();
                // Retry with new token
                response = await fetch(url, {
                    ...options,
                    headers: {
                        ...headers,
                        ...options.headers,
                        "Authorization": `Bearer ${newToken}`
                    }
                });
            } catch (refreshError) {
                console.error("Retry after 401 failed:", refreshError);
                throw new Error("Session expired. Please log in again.");
            }
        }

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`API Error: ${response.status} ${text}`);
        }

        return response.json();
    } catch (error) {
        throw error;
    }
};

export const pathwayService = {
    startPathway: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/start`, {
            method: "POST",
        });
    },

    startEmpathySession1: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/emp/s1/start`, {
            method: "POST",
        });
    },

    sendEmpathyMessage: async (text, phase = "CORE") => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/emp/s1/message`, {
            method: "POST",
            body: JSON.stringify({ text, phase }),
        });
    },

    getEmpathyHistory: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/emp/s1/history`, {
            method: "GET",
        });
    },

    // Session 2 Methods
    startEmpathySession2: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/emp/s2/start`, {
            method: "POST",
        });
    },

    sendEmpathyMessageSession2: async (text, phase = "CORE") => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/emp/s2/message`, {
            method: "POST",
            body: JSON.stringify({ text, phase }),
        });
    },

    getEmpathyHistorySession2: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/emp/s2/history`, {
            method: "GET",
        });
    },

    // Session 3 Methods
    startEmpathySession3: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/emp/s3/start`, {
            method: "POST",
        });
    },

    sendEmpathyMessageSession3: async (text, phase = "CORE") => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/emp/s3/message`, {
            method: "POST",
            body: JSON.stringify({ text, phase }),
        });
    },

    getEmpathyHistorySession3: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/emp/s3/history`, {
            method: "GET",
        });
    },

    // Session 4 Methods
    startEmpathySession4: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/emp/s4/start`, {
            method: "POST",
        });
    },

    sendEmpathyMessageSession4: async (text, phase = "CORE") => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/emp/s4/message`, {
            method: "POST",
            body: JSON.stringify({ text, phase }),
        });
    },

    getEmpathyHistorySession4: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/emp/s4/history`, {
            method: "GET",
        });
    },

    // Goal Setting Session 1 Methods
    startGoalSession1: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/goal/s1/start`, {
            method: "POST",
        });
    },

    sendGoalMessageSession1: async (text, phase = "CORE") => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/goal/s1/message`, {
            method: "POST",
            body: JSON.stringify({ text, phase }),
        });
    },

    getGoalHistorySession1: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/goal/s1/history`, {
            method: "GET",
        });
    },

    // Goal Setting Session 2 Methods
    startGoalSession2: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/goal/s2/start`, {
            method: "POST",
        });
    },

    sendGoalMessageSession2: async (text, phase = "CORE") => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/goal/s2/message`, {
            method: "POST",
            body: JSON.stringify({ text, phase }),
        });
    },

    getGoalHistorySession2: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/goal/s2/history`, {
            method: "GET",
        });
    },

    // Goal Setting Session 3 Methods
    startGoalSession3: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/goal/s3/start`, {
            method: "POST",
        });
    },

    sendGoalMessageSession3: async (text, phase = "CORE") => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/goal/s3/message`, {
            method: "POST",
            body: JSON.stringify({ text, phase }),
        });
    },

    getGoalHistorySession3: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/goal/s3/history`, {
            method: "GET",
        });
    },

    // Goal Setting Session 4 Methods
    startGoalSession4: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/goal/s4/start`, {
            method: "POST",
        });
    },

    sendGoalMessageSession4: async (text, phase = "CORE") => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/goal/s4/message`, {
            method: "POST",
            body: JSON.stringify({ text, phase }),
        });
    },

    getGoalHistorySession4: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/goal/s4/history`, {
            method: "GET",
        });
    },

    // Resilience Session 1 Methods
    startResilienceSession1: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/res/s1/start`, {
            method: "POST",
        });
    },

    sendResilienceMessageSession1: async (text, phase = "CORE") => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/res/s1/message`, {
            method: "POST",
            body: JSON.stringify({ text, phase }),
        });
    },

    getResilienceHistorySession1: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/res/s1/history`, {
            method: "GET",
        });
    },

    // Resilience Session 2 Methods
    startResilienceSession2: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/res/s2/start`, {
            method: "POST",
        });
    },

    sendResilienceMessageSession2: async (text, phase = "CORE") => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/res/s2/message`, {
            method: "POST",
            body: JSON.stringify({ text, phase }),
        });
    },

    getResilienceHistorySession2: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/res/s2/history`, {
            method: "GET",
        });
    },

    // Resilience Session 3 Methods
    startResilienceSession3: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/res/s3/start`, {
            method: "POST",
        });
    },

    sendResilienceMessageSession3: async (text, phase = "CORE") => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/res/s3/message`, {
            method: "POST",
            body: JSON.stringify({ text, phase }),
        });
    },

    getResilienceHistorySession3: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/res/s3/history`, {
            method: "GET",
        });
    },

    // Resilience Session 4 Methods
    startResilienceSession4: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/res/s4/start`, {
            method: "POST",
        });
    },

    sendResilienceMessageSession4: async (text, phase = "CORE") => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/res/s4/message`, {
            method: "POST",
            body: JSON.stringify({ text, phase }),
        });
    },

    getResilienceHistorySession4: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/res/s4/history`, {
            method: "GET",
        });
    },

    // Engagement Session 1 Methods
    startEngagementSession1: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/eng/s1/start`, {
            method: "POST",
        });
    },

    sendEngagementMessageSession1: async (text, phase = "CORE") => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/eng/s1/message`, {
            method: "POST",
            body: JSON.stringify({ text, phase }),
        });
    },

    getEngagementHistorySession1: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/eng/s1/history`, {
            method: "GET",
        });
    },

    // Engagement Session 2 Methods
    startEngagementSession2: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/eng/s2/start`, {
            method: "POST",
        });
    },

    sendEngagementMessageSession2: async (text, phase = "CORE") => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/eng/s2/message`, {
            method: "POST",
            body: JSON.stringify({ text, phase }),
        });
    },

    getEngagementHistorySession2: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/eng/s2/history`, {
            method: "GET",
        });
    },

    // Engagement Session 3 Methods
    startEngagementSession3: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/eng/s3/start`, {
            method: "POST",
        });
    },

    sendEngagementMessageSession3: async (text, phase = "CORE") => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/eng/s3/message`, {
            method: "POST",
            body: JSON.stringify({ text, phase }),
        });
    },

    getEngagementHistorySession3: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/eng/s3/history`, {
            method: "GET",
        });
    },

    // Engagement Session 4 Methods
    startEngagementSession4: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/eng/s4/start`, {
            method: "POST",
        });
    },

    sendEngagementMessageSession4: async (text, phase = "CORE") => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/eng/s4/message`, {
            method: "POST",
            body: JSON.stringify({ text, phase }),
        });
    },

    getEngagementHistorySession4: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/eng/s4/history`, {
            method: "GET",
        });
    },

    // Self Awareness Session 1 Methods
    startSelfAwarenessSession1: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/self/s1/start`, {
            method: "POST",
        });
    },

    sendSelfAwarenessMessageSession1: async (text, phase = "CORE") => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/self/s1/message`, {
            method: "POST",
            body: JSON.stringify({ text, phase }),
        });
    },

    getSelfAwarenessHistorySession1: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/self/s1/history`, {
            method: "GET",
        });
    },

    // Self Awareness Session 2 Methods
    startSelfAwarenessSession2: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/self/s2/start`, {
            method: "POST",
        });
    },

    sendSelfAwarenessMessageSession2: async (text, phase = "CORE") => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/self/s2/message`, {
            method: "POST",
            body: JSON.stringify({ text, phase }),
        });
    },

    getSelfAwarenessHistorySession2: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/self/s2/history`, {
            method: "GET",
        });
    },

    // Self Awareness Session 3 Methods
    startSelfAwarenessSession3: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/self/s3/start`, {
            method: "POST",
        });
    },

    sendSelfAwarenessMessageSession3: async (text, phase = "CORE") => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/self/s3/message`, {
            method: "POST",
            body: JSON.stringify({ text, phase }),
        });
    },

    getSelfAwarenessHistorySession3: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/self/s3/history`, {
            method: "GET",
        });
    },

    // Self Awareness Session 4 Methods
    startSelfAwarenessSession4: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/self/s4/start`, {
            method: "POST",
        });
    },

    sendSelfAwarenessMessageSession4: async (text, phase = "CORE") => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/self/s4/message`, {
            method: "POST",
            body: JSON.stringify({ text, phase }),
        });
    },

    getSelfAwarenessHistorySession4: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/self/s4/history`, {
            method: "GET",
        });
    },

    // Belonging Session 1 Methods
    startBelongingSession1: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/belong/s1/start`, {
            method: "POST",
        });
    },

    sendBelongingMessageSession1: async (text, phase = "CORE") => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/belong/s1/message`, {
            method: "POST",
            body: JSON.stringify({ text, phase }),
        });
    },

    getBelongingHistorySession1: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/belong/s1/history`, {
            method: "GET",
        });
    },

    // Belonging Session 2 Methods
    startBelongingSession2: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/belong/s2/start`, {
            method: "POST",
        });
    },

    sendBelongingMessageSession2: async (text, phase = "CORE") => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/belong/s2/message`, {
            method: "POST",
            body: JSON.stringify({ text, phase }),
        });
    },

    getBelongingHistorySession2: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/belong/s2/history`, {
            method: "GET",
        });
    },

    // Belonging Session 3 Methods
    startBelongingSession3: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/belong/s3/start`, {
            method: "POST",
        });
    },

    sendBelongingMessageSession3: async (text, phase = "CORE") => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/belong/s3/message`, {
            method: "POST",
            body: JSON.stringify({ text, phase }),
        });
    },

    getBelongingHistorySession3: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/belong/s3/history`, {
            method: "GET",
        });
    },

    // Belonging Session 4 Methods
    startBelongingSession4: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/belong/s4/start`, {
            method: "POST",
        });
    },

    sendBelongingMessageSession4: async (text, phase = "CORE") => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/belong/s4/message`, {
            method: "POST",
            body: JSON.stringify({ text, phase }),
        });
    },

    getBelongingHistorySession4: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/belong/s4/history`, {
            method: "GET",
        });
    },

    // Generic Methods
    getNextSessionInfo: async () => {
        return await authenticatedFetch(`${API_PATHWAY_URL}/next-session`, {
            method: "GET",
        });
    }
};
