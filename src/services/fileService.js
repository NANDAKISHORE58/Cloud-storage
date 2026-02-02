// File Service - Mock implementation for development
const API_ENDPOINT = 'https://2oepisw9e3.execute-api.ap-south-1.amazonaws.com/prod';

// Mock file storage
let mockFiles = [
    {
        name: 'sample-document.pdf',
        size: 1024000,
        lastModified: new Date().toISOString(),
        versionId: 'v1.0.0'
    },
    {
        name: 'presentation.pptx',
        size: 2048000,
        lastModified: new Date(Date.now() - 86400000).toISOString(),
        versionId: 'v2.1.0'
    }
];

export const fileService = {
    async uploadFile(file, token) {
        try {
            // Simulate upload delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Add file to mock storage
            const newFile = {
                name: file.name,
                size: file.size,
                lastModified: new Date().toISOString(),
                versionId: 'v1.0.0'
            };
            
            mockFiles.push(newFile);
            
            return { success: true, message: 'File uploaded successfully' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async listFiles(token) {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            return { success: true, files: mockFiles };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async downloadFile(fileKey, token) {
        try {
            // Mock download - just show alert for demo
            alert(`Downloading: ${fileKey}`);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async deleteFile(fileKey, token) {
        try {
            // Remove from mock storage
            mockFiles = mockFiles.filter(file => file.name !== fileKey);
            
            return { success: true, message: 'File deleted successfully' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};
