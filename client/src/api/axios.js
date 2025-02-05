import axios from 'axios';
import toast from 'react-hot-toast';

const serverBaseUrl = "http://localhost:4000/api";
// const serverBaseUrl = "http://192.168.29.5:4000/api";

// Create an Axios instance
const apiClient = axios.create({
    baseURL: serverBaseUrl,
    timeout: 100000, // Set a timeout
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // You can modify the request config here (e.g., add an authorization token)
        const token = localStorage.getItem('auth_token'); // Example: Get token from localStorage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle request error
        console.error('Request Interceptor Error:', error);
        return Promise.reject(error);
    }
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => {
        if (response.status === 201 ) {
            toast(response.data.message, {
                style: {
                    border: '1px solid #5ca336',
                    borderRadius: '0px',
                    padding: '8px',
                    color: '#fff', 
                    backgroundColor: '#1a1a1a',
                },
                icon: "✔️"
            });
        }
        const token = localStorage.getItem('auth_token'); // Example: Get token from localStorage
        return response;
    },
    
    (error) => {
        // Handle errors globally
        console.log('Axios response Error => ', error);
        if (error.status === 401) {
            location.pathname = "/get-started"
        }
        toast.error(error.response.data.message, {
            style: {
                border: '1px solid #ff4040',
                borderRadius: '0px',
                padding: '8px',
                color: '#fff',
                backgroundColor: '#1a1a1a',
            },
            iconTheme: {
                primary: '#ff1e1e',
                secondary: '#FFFAEE',
            },
        });
        return Promise.reject(error);
    }
);

export default apiClient; 