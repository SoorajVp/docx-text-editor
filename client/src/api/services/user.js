import axios from "axios";
import apiClient from "../axios";


const userService = {
    GetUserDetails: async () => {
        try {
            const response = await apiClient.get(`/user/get-info`);
            return response.data
        } catch (error) {
            throw error
        }
    },

    UpdateUserDetails: async (payload) => {
        try {
            const response = await apiClient.post(`/user/update`, payload);
            return response.data
        } catch (error) {
            throw error
        }
    },

}

export default userService;