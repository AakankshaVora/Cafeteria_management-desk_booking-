import axios from "axios";

// Create Axios Instance
const api = axios.create({
    baseURL: "http://127.0.0.1:5000", // Flask Backend URL
    headers: {
        "Content-Type": "application/json",
    },
});

// Memory Token Storage
let authToken = null;

export const setToken = (token) => {
    authToken = token;
    console.log("DEBUG: Token updated in memory");
};

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
    (config) => {
        console.log("DEBUG: Interceptor running for", config.url);

        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
            console.log("DEBUG: Authorization header set");
        } else {
            console.warn("DEBUG: No token in memory");
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Global Errors (Optional)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error("DEBUG: API Error for", error.config?.url);
        if (error.response) {
            console.error("DEBUG: Status:", error.response.status);
        }

        if (error.response && error.response.status === 401) {
            console.warn("DEBUG: 401 Unauthorized - Token might be invalid or expired");
            // Dispatch event for AuthContext to handle logout
            window.dispatchEvent(new CustomEvent("auth:logout"));
        }
        return Promise.reject(error);
    }
);

export default api;
