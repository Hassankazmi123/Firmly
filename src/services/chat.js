const API_BASE_URL = process.env.REACT_APP_API_URL || "http://16.16.141.229:8000";
const API_AUTH_URL = `${API_BASE_URL}/api/auth`;

const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
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
        console.log("🔄 Attempting to refresh token...");
        // Try standard SimpleJWT endpoint first
        let response = await fetch(`${API_AUTH_URL}/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: refreshToken })
        });

        // If 404, try alternative endpoint
        if (response.status === 404) {
            console.log("⚠️ /token/refresh/ not found, trying /refresh/...");
            response = await fetch(`${API_AUTH_URL}/refresh/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh: refreshToken })
            });
        }

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Refresh failed: ${response.status} ${text}`);
        }

        const data = await response.json();
        const newAccess = data.access || data.access_token || data.token;
        const newRefresh = data.refresh || data.refresh_token;

        if (!newAccess) {
            throw new Error("No access token in refresh response");
        }

        console.log("✅ Token refreshed successfully");
        localStorage.setItem("accessToken", newAccess);
        if (newRefresh) {
            localStorage.setItem("refreshToken", newRefresh);
        }

        return newAccess;
    } catch (error) {
        console.error("❌ Token refresh failed:", error);
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

        // If 401, try to refresh token and retry
        if (response.status === 401) {
            console.warn("⚠️ 401 Unauthorized, attempting to refresh token...");
            try {
                const newToken = await refreshAccessToken();

                // Update headers with new token
                headers = {
                    ...headers,
                    "Authorization": `Bearer ${newToken}`
                };

                // Retry original request
                response = await fetch(url, {
                    ...options,
                    headers: { ...headers, ...options.headers }
                });
            } catch (refreshError) {
                // If refresh failed, throw session expired error
                console.error("Session refresh failed:", refreshError);
                throw new Error("Session expired. Please log in again.");
            }
        }

        return handleResponse(response);
    } catch (error) {
        throw error;
    }
};

const handleResponse = async (response) => {
    if (response.status === 401) {
        // This should only be reached if retry failed or wasn't attempted
        throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        throw new Error(`API Error: ${response.status} ${errorText}`);
    }

    return response.json();
};

export const chatService = {
    /**
     * 1. Create a new free chat thread
     */
    createNewThread: async (incognito = false, title = "New Chat") => {
        try {
            return await authenticatedFetch(`${API_AUTH_URL}/chat/free/new`, {
                method: "POST",
                body: JSON.stringify({ incognito, title }),
            });
        } catch (error) {
            console.error("CreateNewThread Exception:", error);
            throw error;
        }
    },

    /**
     * 2. List user's free chat threads
     */
    listThreads: async () => {
        try {
            return await authenticatedFetch(`${API_AUTH_URL}/chat/free/threads`, {
                method: "GET",
            });
        } catch (error) {
            console.error("ListThreads Exception:", error);
            throw error;
        }
    },

    /**
     * 3. Get chat history for a thread
     */
    getChatHistory: async (threadId) => {
        try {
            return await authenticatedFetch(`${API_AUTH_URL}/chat/free/${threadId}/history`, {
                method: "GET",
            });
        } catch (error) {
            console.error("GetChatHistory Exception:", error);
            throw error;
        }
    },

    /**
     * 4. Send a message in a chat thread
     */
    sendMessage: async (threadId, text) => {
        try {
            return await authenticatedFetch(`${API_AUTH_URL}/chat/free/${threadId}/message`, {
                method: "POST",
                body: JSON.stringify({ text }),
            });
        } catch (error) {
            console.error("SendMessage Exception:", error);
            throw error;
        }
    },

    /**
     * 5. Send a message in incognito mode (with context)
     */
    sendIncognitoMessage: async (threadId, text, incognitoContext = []) => {
        try {
            return await authenticatedFetch(`${API_AUTH_URL}/chat/free/${threadId}/message`, {
                method: "POST",
                body: JSON.stringify({
                    text: text,
                    incognito_context: incognitoContext,
                }),
            });
        } catch (error) {
            console.error("SendIncognitoMessage Exception:", error);
            throw error;
        }
    },

    /**
     * 6. Close a chat thread
     */
    closeThread: async (threadId) => {
        try {
            return await authenticatedFetch(`${API_AUTH_URL}/chat/free/${threadId}/close`, {
                method: "POST",
            });
        } catch (error) {
            console.error("CloseThread Exception:", error);
            throw error;
        }
    },
};
