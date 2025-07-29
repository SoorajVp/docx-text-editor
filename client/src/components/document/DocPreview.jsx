import React from 'react';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

const DocumentPreview = ({ file }) => {
    if (!file) return (
        <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500">No document selected</p>
        </div>
    );

    // Map file extensions to proper MIME types
    const getFileType = (url, originalType) => {
        if (originalType) {
            if (originalType.includes('wordprocessingml')) return 'docx';
            if (originalType.includes('presentationml')) return 'pptx';
            return originalType.split('/').pop();
        }

        // Fallback for URLs
        const extension = url.split('.').pop().toLowerCase();
        if (extension === 'docx') return 'docx';
        if (extension === 'pptx') return 'pptx';
        return extension;
    };

    const docs = [{
        uri: file.url,
        fileType: getFileType(file.url, file.type),
        fileName: file.name
    }];

    return (
        <div className="h-full w-full bg-white border border-gray-200 dark:border-gray-700 overflow-scroll">
            <DocViewer
                key={file.url}
                documents={docs}
                pluginRenderers={DocViewerRenderers}
                config={{
                    header: {
                        disableHeader: true,
                        disableFileName: true,
                    },
                    loadingRenderer: {
                        overrideComponent: () => (
                            <div className="h-full flex items-center justify-center">
                                <p>Loading document...</p>
                            </div>
                        ),
                    },
                }}
            />
        </div>
    );
};

export default DocumentPreview;