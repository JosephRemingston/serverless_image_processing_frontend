import axios from "axios";

const BASE_URL = "https://serverless-image-processing.vercel.app/api";

// Create axios instance
const api = axios.create({
    baseURL: BASE_URL
});

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        const accessToken = localStorage.getItem('accessToken');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            // Add Cognito access token if the request is going to AWS services
            if (config.url.includes('generate-signed-url')) {
                config.headers['Cognito-Token'] = accessToken;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear stored auth data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            // Reload the page to reset the app state
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Helper for consistent error handling
const handleError = (err) => {
    if (err.response) {
        console.error("Backend Error:", err.response.data);
        throw new Error(err.response.data.message || "Request failed");
    } else if (err.request) {
        console.error("No Response:", err.request);
        throw new Error("No response from server");
    } else {
        console.error("Unexpected Error:", err.message);
        throw new Error("Unexpected error occurred");
    }
};

// Signup
export const signupUser = async ({ username, password, email }) => {
    try {
        const res = await api.post('/auth/signup', {
            username,
            password,
            email,
        }, {
            headers: { "Content-Type": "application/json" , 'ngrok-skip-browser-warning': 'true'}
        });

        return res.data;
    } catch (err) {
        handleError(err);
    }
};

// Confirm User
export const confirmUser = async ({ username, code }) => {
    try {
        const res = await api.post('/auth/confirm-user', {
            username,
            code,
        }, {
            headers: { "Content-Type": "application/json" , 'ngrok-skip-browser-warning': 'true'}
        });

        return res.data;
    } catch (err) {
        handleError(err);
    }
};

// Login
export const loginUser = async (username, password) => {
    if (!username || !password) {
        throw new Error("Username and password are required");
    }

    try {
        const res = await api.post('/auth/signin', {
            username: username.toString(),
            password: password.toString(),
        }, {
            headers: { "Content-Type": "application/json" , 'ngrok-skip-browser-warning': 'true'}
        });

        return res.data;
    } catch (err) {
        handleError(err);
    }
};

// Get Profile
export const getProfile = async (token) => {
    try {
        const res = await api.get('/user/profile', {
            headers: { Authorization: `Bearer ${token}` , 'ngrok-skip-browser-warning': 'true'}
        });

        return res.data.data;
    } catch (err) {
        handleError(err);
    }
};

// Generate Signed URL
export const generateSignedUrl = async (token) => {
    try {
        const res = await api.get('/media/generate-signed-url', {
            headers: { Authorization: `Bearer ${token}` , 'ngrok-skip-browser-warning': 'true'}
        });

        return res.data.data;
    } catch (err) {
        handleError(err);
    }
};
