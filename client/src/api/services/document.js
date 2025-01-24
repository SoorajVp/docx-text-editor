import apiClient from "../axios"


const documentService = {

    GetDocumentTextBlocks: async (url) => {
        const response = await apiClient.get(`/document/get-text-blocks?documentUrl=${url}`);
        return response.data
    },

    UpdateDocument: async (payload) => {
        const response = await apiClient.post(`/document/update-document`, payload);
        return response.data
    },
}

export default documentService