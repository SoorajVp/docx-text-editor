import axios from 'axios';
import toast from 'react-hot-toast';

const serverBaseUrl = "http://localhost:4000/api";
// const serverBaseUrl = "http://192.168.29.5:4000/api";

// Create an Axios instance
const apiClient = axios.create({
    baseURL: serverBaseUrl,
    timeout: 100000, // Set a timeout
});

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => {
        console.log("Axios response => ", response)
        if (response.status === 201 ) {
            toast(response.data.message, {
                style: {
                    border: '1px solid #fca03d',
                    borderRadius: '0px',
                    padding: '8px',
                    color: '#fff', 
                    backgroundColor: '#1a1a1a',
                },
                icon: "✔️"
            });
        }
        return response;
    },
    
    (error) => {
        // Handle errors globally
        console.log('Axios response Error => ', error);
        toast.error('Something went wrong', {
            style: {
                border: '1px solid #fca03d',
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