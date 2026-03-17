const API_BASE_URL = process.env.REACT_APP_API_URL || "http://16.16.141.229:8000";
export const API_AUTH_URL = `${API_BASE_URL}/api/auth`;
export const API_PATHWAY_URL = `${API_BASE_URL}/api/pathway`;
export const API_URL = API_BASE_URL;

export const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    const headers = { "Content-Type": "application/json" };
    if (!token) {
        console.warn("No access token found in localStorage");
    } else {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
};

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
        throw new Error("No refresh token available");
    }

    try {
        console.log("Attempting to refresh token...");
        let response = await fetch(`${API_AUTH_URL}/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: refreshToken })
        });

        if (response.status === 404) {
            console.log("/token/refresh/ not found, trying /refresh/...");
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
        const newAccess = data.access || data.access_token || data.token || data.key || (data.tokens && (data.tokens.access || data.tokens.access_token));
        const newRefresh = data.refresh || data.refresh_token || (data.tokens && (data.tokens.refresh || data.tokens.refresh_token));


        if (!newAccess) {
            throw new Error("No access token in refresh response");
        }

        console.log("Token refreshed successfully");
        localStorage.setItem("accessToken", newAccess);
        if (newRefresh) {
            localStorage.setItem("refreshToken", newRefresh);
        }

        return newAccess;
    } catch (error) {
        console.error("Token refresh failed:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        throw error;
    }
};

const handleResponse = async (response) => {
    if (response.status === 401) {
        throw new Error("Session expired. Please log in again.");
    }

    if (response.status === 204) {
        return null;
    }

    if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        throw new Error(`API Error: ${response.status} ${errorText}`);
    }

    try {
        return await response.json();
    } catch (e) {
        return {};
    }
};

export const authenticatedFetch = async (url, options = {}) => {
    const { returnRawResponse, ...fetchOptions } = options;
    let headers = getAuthHeaders();

    try {
        let response = await fetch(url, {
            ...fetchOptions,
            headers: { ...headers, ...fetchOptions.headers }
        });

        // If unauthorized, or forbidden but a refresh token exists, try refreshing once
        const hasRefresh = !!localStorage.getItem("refreshToken");
        const shouldAttemptRefresh = response.status === 401 || (response.status === 403 && hasRefresh);

        if (shouldAttemptRefresh) {
            console.warn("Auth failed, attempting to refresh token...");
            try {
                const newToken = await refreshAccessToken();

                headers = {
                    ...headers,
                    "Authorization": `Bearer ${newToken}`
                };

                response = await fetch(url, {
                    ...fetchOptions,
                    headers: { ...headers, ...fetchOptions.headers }
                });
            } catch (refreshError) {
                console.error("Session refresh failed:", refreshError);
                throw new Error("Session expired. Please log in again.");
            }
        }

        if (returnRawResponse) {
            return response;
        }

        return handleResponse(response);
    } catch (error) {
        throw error;
    }
};
export const getUserProfile = async () => {
    return await authenticatedFetch(`${API_AUTH_URL}/profile/`);
};
export const changePassword = async (passwordData) => {
    return await authenticatedFetch(`${API_AUTH_URL}/change-password/`, {
        method: "POST",
        body: JSON.stringify(passwordData)
    });
};
