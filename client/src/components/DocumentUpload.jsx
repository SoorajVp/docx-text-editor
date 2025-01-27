import React, { useState } from "react";

const DocumentUpload = () => {
    const [file, setFile] = useState(null);

    const handleFileUpload = (event) => {
        const uploadedFiles = Array.from(event.target.files)
        setFile(uploadedFiles[0]);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFiles = Array.from(event.dataTransfer.files);
        setFile(droppedFiles[0]);
    };

    const removeFile = () => {
        setFile(null);
    };

    console.log("file", file)
    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="w-full max-w-3xl mx-4 p-6 bg-white dark:bg-neutral-950 shadow-lg">
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
                        multiple
                        onChange={handleFileUpload}
                    />
                    <label
                        htmlFor="fileUpload"
                        className="px-4 py-1 bg-orange-500 hover:bg-orange-600 text-white shadow-md transition duration-300"
                    >
                        Choose Files
                    </label>
                </div>

                { file && (
                    <div className="mt-6">
                       
                        <ul className="space-y-2">
                            <li
                                className="flex justify-between items-center bg-neutral-200 dark:bg-neutral-800 px-4 py-2 rounded-lg"
                            >
                                <span className="text-gray-700 dark:text-gray-300">
                                   Selected :  {file.name}
                                </span>
                                <button
                                    className="text-red-500 hover:text-red-600 transition duration-300"
                                    onClick={() => removeFile()}
                                >
                                    Remove
                                </button>
                            </li>
                        </ul>
                        <button
                            className="w-full mt-3 py-2 border-2 border-orange-400 font-semibold text-orange-600 dark:text-orange-400 hover:text-white dark:hover:text-white hover:bg-orange-500 shadow-md transition duration-500"
                        >
                            UPLOAD
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentUpload;
