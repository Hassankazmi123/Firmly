
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://16.16.141.229:8000";
const API_PATHWAY_URL = `${API_BASE_URL}/api/pathway`; // Assumed based on {{apiPathway}}

const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

const authenticatedFetch = async (url, options = {}) => {
    const headers = getAuthHeaders();
    const response = await fetch(url, {
        ...options,
        headers: { ...headers, ...options.headers }
    });

    if (response.status === 401) {
        throw new Error("Session expired");
    }

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`API Error: ${response.status} ${text}`);
    }

    return response.json();
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
    }
};
