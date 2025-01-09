import React from 'react'
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer';

const ViewDocument = ({ url }) => {
    const customTheme = {
        primary: "#242424", // Primary color (e.g., buttons or highlights)
        secondary: "#242424", // Secondary color (e.g., backgrounds)
        tertiary: "#ffff", // Tertiary color (e.g., text)
        textPrimary: "#ffffff", // Primary text color
    };
    return (
        <DocViewer documents={[{ uri: url, fileType: "docx" }]} pluginRenderers={DocViewerRenderers} theme={customTheme} className="custom-doc-viewer" />
    )
}

export default ViewDocument