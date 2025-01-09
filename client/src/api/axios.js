import axios from 'axios';

// const serverBaseUrl = "http://localhost:4000/api";
const serverBaseUrl = "http://192.168.29.5:4000/api";

// Create an Axios instance
const apiClient = axios.create({
    baseURL: serverBaseUrl,
    timeout: 100000, // Set a timeout
});

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle errors globally
        console.log('Axios response Error => ', error);
        return Promise.reject(error);
    }
);

export default apiClient;
