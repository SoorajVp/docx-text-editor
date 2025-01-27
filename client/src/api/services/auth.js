import axios from "axios";
import apiClient from "../axios";


const authService = {
    GetGoogleUserDatils: async (access_token) => {
        try {
            const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        Accept: "application/json",
                    },
                })
                
            return response.data
        } catch (error) {
            throw error
        }
    },
    GoogleLogin: async (payload) => {
        const response = await apiClient.post(`/auth/google-login`, payload);
        return response.data
    }
}

export default authService;