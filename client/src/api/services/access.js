import apiClient from "../axios";

const accessService = {
    sendAccessInvitation: async (payload) => {
        try {
            const response = await apiClient.post(`/access/send-invite`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    acceptAccessInvitation: async (payload) => {
        try {
            const response = await apiClient.post(`/access/accept-invitation`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    enableFileEditing: async (payload) => {
        try {
            const response = await apiClient.post(`/access/enable-editing`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    GetSharedDocument: async (accessId, documentId) => {
        try {
            const response = await apiClient.get(`/access/shared-document?accessId=${accessId}&documentId=${documentId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    GetSharedFileList: async () => {
        try {
            const response = await apiClient.get(`/access/shared-files`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    GetDocumentAccessList: async (docId) => {
        try {
            const response = await apiClient.get(`/access/document-access?doc_id=${docId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    GetSharedDocumentTextBlocks: async (accessId) => {
        try {
            const response = await apiClient.get(`/access/shared-text-blocks?accessId=${accessId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default accessService;
