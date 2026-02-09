import { authenticatedFetch, API_AUTH_URL } from "./api";

export const chatService = {
    /**
     * 1. Create a new free chat thread
     */
    createNewThread: async (incognito = true, title = "New Chat") => {
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
