
export const GetFileExtension = (mimeType) => {
    switch (mimeType) {
        case "application/pdf":
            return "pdf";
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            return "docx";
        case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
            return "pptx";

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

export const DownloadDocument = async (url, fileName) => {
    try {
        // Fetch the file as a Blob
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch file");

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        // Create a temporary anchor element
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName || "download"; // Default name if not provided
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error("Download failed:", error);
    }
};
