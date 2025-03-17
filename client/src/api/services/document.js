import apiClient from "../axios"


const documentService = {

    UploadDocument: async (payload) => {
        const response = await apiClient.post(`/document/create`, payload);
        return response.data
    },
    GetUserDocuments: async (value) => {
        const response = await apiClient.get(`/document/list?search=${value}`);
        return response.data
    },

    GetDocumentById: async (docId) => {
        const response = await apiClient.get(`/document/view?id=${docId}`);
        return response.data
    },

    GetBinDocuments: async () => {
        const response = await apiClient.get(`/document/bin-files`);
        return response.data
    },
    GetDocumentTextBlocks: async (url) => {
        const response = await apiClient.get(`/document/text-blocks?documentUrl=${url}`);
        return response.data
    },

    UpdateDocument: async (payload) => {
        const response = await apiClient.post(`/document/update`, payload);
        return response.data
    },
}

export default documentService