import axios from "axios";
import apiClient from "../axios";


const authService = {
    GoogleLogin: async (access_token) => {
        try {
            const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        Accept: "application/json",
                    },
                })
            const dbResponse = await apiClient.post(`/auth/google-login`, response.data);
            return dbResponse.data
        } catch (error) {
            throw error
        }
    },
    
}

export default authService;