import React from 'react';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import "./Document.css";

const DocumentViewer = ({ file, url }) => {
    return (
        <DocViewer
            documents={[file ? { file } : { uri: url }]}
            pluginRenderers={DocViewerRenderers}
            style={{ height: '100%' }}
            className="h-max w-full max-w-screen-md overflow-auto shadow-lg"
        />
    );
};

export default DocumentViewer;
