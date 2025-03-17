import React from 'react'
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import "./Document.css"

const DocumentViewer = ({ url, mime_type }) => {
    return (

        <DocViewer
            documents={[{ uri: url }]} style={{ height: '100%' }}
            pluginRenderers={DocViewerRenderers}
            className="h-max w-full max-w-screen-md overflow-auto border border-orange-600"
        />
    )
}

export default DocumentViewer