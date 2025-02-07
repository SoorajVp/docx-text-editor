
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

const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const now = new Date();

    // Extract parts
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    // Format time (e.g., "4:59 AM")
    const timeString = date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    if (isToday) return `Today, ${timeString}`;
    if (isYesterday) return `Yesterday, ${timeString}`;

    // Format full date (e.g., "Feb 7, 2025, 4:59 AM")
    return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

// Example Usage
console.log(formatDate("2025-02-07T04:59:37.114Z"));
console.log(formatDate(new Date().toISOString())); // Today
console.log(formatDate(new Date(Date.now() - 86400000).toISOString())); // Yesterday
