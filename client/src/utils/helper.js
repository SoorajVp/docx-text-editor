
export const getFileIcon = (mimeType) => {
    switch (mimeType) {
        case "application/pdf":
            return "/icons/pdf_icon.png";
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            return "/icons/docx_icon.png";
        case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
            return "/icons/pptx_icon.png";

        default:
            return "/icons/default_icon.png"; // Default icon
    }
};

export const getFileSizeInMB = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2) + "MB" // Convert to MB and keep 2 decimal places
};


export const formatDate = (isoTime) => {
    const date = new Date(isoTime);
    const options = { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: 'numeric', hour12: true };
    const indianTime = date.toLocaleString('en-IN', options);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

    const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (inputDate.getTime() === today.getTime()) {
        return `Today ${indianTime}`;
    } else if (inputDate.getTime() === yesterday.getTime()) {
        return `Yesterday ${indianTime}`;
    } else {
        const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-IN', dateOptions);
    }
}

