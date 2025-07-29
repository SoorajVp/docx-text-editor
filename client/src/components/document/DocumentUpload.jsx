import React, { useState } from "react";
import documentService from "../../api/services/document";
import { useNavigate } from "react-router-dom";
import { setPageLoading } from "../../redux/slice/userSlice";
import { useDispatch } from "react-redux";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import DocumentPreview from "./DocPreview";

const DocumentUpload = ({ onSubmit }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [fileURL, setFileURL] = useState(null);

    const validFileTypes = [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
        "application/pdf", // pdf
    ];

    const handleFileUpload = (event) => {
        const uploadedFiles = Array.from(event.target.files);
        console.log('uploadedFiles[0]', uploadedFiles[0])
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
        if (fileURL?.url) {
            URL.revokeObjectURL(fileURL.url); // Clean up old blob
        }

        if (file && validFileTypes.includes(file.type)) {
            setFile(file);
            setError("");
            const blobUrl = URL.createObjectURL(file);
            setFileURL({
                url: blobUrl,
                name: file.name,
                type: file.type.split('/').pop().split('.').pop()
            });
        } else {
            setFile(null);
            setFileURL(null);
            setError("Invalid file type. Please upload a .docx, .pptx, or .pdf file.");
        }
    };


    const removeFile = () => {
        if (fileURL?.url) {
            URL.revokeObjectURL(fileURL.url); // Clean up memory
        }
        setFile(null);
        setFileURL(null);
        setError("");
    };

    return (
        <div className="h-full w-full flex items-center justify-center">
            {file ? (
                <div className="h-full w-full max-w-3xl">
                    
                    <div className="flex mt-2 gap-2">
                        <div className="flex justify-between items-center bg-neutral-200 w-full dark:bg-neutral-700 px-3 py-1">
                            <span className="text-gray-700 text-sm dark:text-gray-300">
                                Selected : {file.name}
                            </span>
                            <button
                                className="text-gray-700 dark:text-gray-300 transition duration-300"
                                onClick={removeFile}
                            >
                                <IoCloseSharp size={25} />
                            </button>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            id="fileUpload"
                            onChange={handleFileUpload}
                            accept=".pdf,.docx,.pptx"
                        />
                        <label
                            htmlFor="fileUpload"
                            className="py-1.5 px-5 bg-transparent text-nowrap border border-orange-500 text-orange-500 hover:bg-orange-500 text-sm hover:text-white shadow-md transition duration-300"
                        >   
                            Change File
                        </label>
                        <button
                            onClick={() => onSubmit(file)}
                            className="py-1.5 px-5 text-nowrap bg-orange-500 text-sm hover:bg-orange-600 text-white shadow-md transition duration-300"
                        >
                            Submit Document
                        </button>
                    </div>

                    {/* Document Preview */}
                    <div className="mt-2 h-[83vh]">
                        {fileURL?.type === "pdf" ? (
                            <DocumentPreview file={fileURL} />
                        ) : (
                            <div className="h-full flex flex-col justify-center items-center bg-white dark:bg-neutral-800 p-6">
                                <div className="mb-4 text-center">
                                    <p className="text-gray-800 dark:text-gray-200 font-medium text-lg">
                                        Preview not available for this file type
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        You selected a <span className="font-semibold">{fileURL?.type?.toUpperCase()}</span> document.
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-neutral-200 dark:bg-neutral-700 px-4 py-2 rounded-md shadow-sm">
                                        <p className="text-gray-800 dark:text-gray-100 text-sm">
                                            <strong>File:</strong> {fileURL?.name}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                                            <strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>


                  
                </div>
            ) : (
                <div className="w-full max-w-3xl mx-4 p-6">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200 text-center">
                        Upload Documents
                    </h1>
                    <div
                        className="border-2 border-dashed border-orange-400 bg-neutral-100 dark:bg-neutral-800 p-6 flex flex-col items-center justify-center cursor-pointer rounded-lg"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                            <FaCloudUploadAlt className="text-neutral-400 dark:text-neutral-600 w-auto h-40" />
                        <p className="text-center text-gray-700 dark:text-gray-300 -mt-3">
                            Drag and drop your files here, or click to select
                        </p>
                        <input
                            type="file"
                            className="hidden"
                            id="fileUpload"
                            onChange={handleFileUpload}
                            accept=".pdf,.docx,.pptx"
                        />
                        <label
                            htmlFor="fileUpload"
                            className="px-6 py-2 mt-5 bg-orange-500 hover:bg-orange-600 text-white shadow-md transition duration-300 cursor-pointer"
                        >
                            Choose File
                        </label>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm mt-2 text-center">
                            {error}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default DocumentUpload;