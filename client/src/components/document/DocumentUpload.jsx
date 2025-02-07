import React, { useState } from "react";
import documentService from "../../api/services/document";
import { useNavigate } from "react-router-dom";
import { setPageLoading } from "../../redux/slice/userSlice";
import { useDispatch } from "react-redux";

const DocumentUpload = () => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const validFileTypes = [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
        "application/pdf", // pdf
    ];

    const handleFileUpload = (event) => {
        const uploadedFiles = Array.from(event.target.files);
        validateFile(uploadedFiles[0]);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFiles = Array.from(event.dataTransfer.files);
        validateFile(droppedFiles[0]);
    };

    const validateFile = (file) => {
        if (file && validFileTypes.includes(file.type)) {
            setFile(file);
            setError("");
        } else {
            setFile(null);
            setError("Invalid file type. Please upload a .docx, .pptx, or .pdf file.");
        }
    };

    const removeFile = () => {
        setFile(null);
        setError("");
    };

    const handleFileSubmit = async() => {
        dispatch(setPageLoading())
        const formData = new FormData();
        formData.append("document", file);
        await documentService.UploadDocument(formData)
        dispatch(setPageLoading())
        navigate("/")
    }
    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="w-full max-w-3xl mx-4 p-6 bg-white dark:bg-neutral-950 border border-gray-300 dark:border-gray-800 shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200 text-center">
                    Upload Documents
                </h1>
                <div
                    className="border-2 border-dashed border-orange-400 bg-neutral-100 dark:bg-neutral-800 p-6 flex flex-col items-center justify-center space-y-4 cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <p className="text-center text-gray-700 dark:text-gray-300">
                        Drag and drop your files here, or click to select
                    </p>
                    <input
                        type="file"
                        className="hidden"
                        id="fileUpload"
                        onChange={handleFileUpload}
                    />
                    <label
                        htmlFor="fileUpload"
                        className="px-4 py-1 bg-orange-500 hover:bg-orange-600 text-white shadow-md transition duration-300"
                    >
                        Choose Files
                    </label>
                </div>

                {error && (
                    <p className="text-red-500 text-sm mt-2 text-center">
                        {error}
                    </p>
                )}

                {file && (
                    <div className="mt-6">
                        <ul className="space-y-2">
                            <li
                                className="flex justify-between items-center bg-neutral-200 dark:bg-neutral-800 px-4 py-2 rounded-lg"
                            >
                                <span className="text-gray-700 dark:text-gray-300">
                                    Selected : {file.name}
                                </span>
                                <button
                                    className="text-red-500 hover:text-red-700 transition duration-300"
                                    onClick={() => removeFile()}
                                >
                                    Remove
                                </button>
                            </li>
                        </ul>
                        <button onClick={handleFileSubmit}
                            className="w-full mt-3 py-1 bg-orange-500 hover:bg-orange-600 text-white shadow-md transition duration-300"
                        >
                            Submit Document
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentUpload;
