import { saveAs } from 'file-saver';
import toast from 'react-hot-toast'

export const GetFileExtension = (mimeType) => {
    switch (mimeType) {
        case "application/pdf":
            return "pdf";
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            return "docx";
        case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
            return "pptx";

        default:
            return "unKnown"; // Default icon
    }
};

export const getFileSizeInMB = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2) + "MB" // Convert to MB and keep 2 decimal places
};

export const getFileNameOG=(fileName) =>{
    return fileName?.split('.').slice(0, -1).join('.');
}

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


export const DownloadFile = async (url, fileName) => {
    try {
        toast.loading("File Downloading...", {
            style: {
                border: '1px solid #5ca336',
                borderRadius: '5px',
                padding: '8px',
                color: '#fff',
                backgroundColor: '#1a1a1a',
            }
        });
        const response = await fetch(url);
        const blob = await response.blob();
        saveAs(blob, fileName); // Triggers the download
        toast.dismiss()
        toast("Download Completed", {
            style: {
                border: '1px solid #5ca336',
                borderRadius: '5px',
                padding: '8px',
                color: '#fff',
                backgroundColor: '#1a1a1a',
            },
            icon: "✔️"
        });
    } catch (error) {
        toast.dismiss()
        console.error('Download failed:', error);
        toast.error("Error While Downloading", {
            style: {
                border: '1px solid #ff4040',
                borderRadius: '0px',
                padding: '8px',
                color: '#fff',
                backgroundColor: '#1a1a1a',
            },
            iconTheme: {
                primary: '#ff1e1e',
                secondary: '#FFFAEE',
            },
        });
    }

}