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

    UpdateFileName: async (payload) => {
        const response = await apiClient.post(`/document/change-filename`, payload);
        return response.data
    },

    GetDocumentTextBlocks: async (id) => {
        const response = await apiClient.get(`/document/text-blocks?id=${id}`);
        return response.data
    },

    UpdateDocument: async (payload) => {
        const response = await apiClient.post(`/document/update`, payload);
        return response.data
    },

    GetDocumentById: async (documentId) => {
        const response = await apiClient.get(`/document/view?id=${documentId}`);
        return response.data
    },

    DocumentSoftDelete: async (documentId) => {
        const response = await apiClient.post(`/document/move-to-bin?id=${documentId}`,);
        return response.data
    },

    RestoreBinFiles: async (payload) => {
        const response = await apiClient.post(`/document/restore-bin`, payload);
        return response.data
    },

    GetBinDocuments: async () => {
        const response = await apiClient.get(`/document/bin-files`);
        return response.data
    },

    DeleteBinDocuments: async (payload) => {
        console.log("payloaadddd", payload)
        const response = await apiClient.post('/document/delete', payload);
        return response.data
    },
    

    
}

export default documentService