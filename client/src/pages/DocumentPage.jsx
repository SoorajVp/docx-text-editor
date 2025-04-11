import React, { useState, useRef } from "react";
import DocumentViewer from "../components/document/DocViewer";
import { useSelector } from "react-redux";

const DocumentPage = () => {
    const [fileUrl, setFileUrl] = useState(null);
    const [inputUrl, setInputUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef();
    const { darkMode } = useSelector((store) => store.user);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setFileUrl(url);
            setSelectedFile(file);
            setInputUrl("");
        }
    };

    const handleUrlView = () => {
        setFileUrl(inputUrl);
        setSelectedFile(null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setFileUrl(url);
            setSelectedFile(file);
            setInputUrl("");
        }
    };

    console.log('fileUrl', fileUrl)

    const handleDragOver = (e) => e.preventDefault();

    return (
        <div className={`min-h-screen ${darkMode === "true" ? "dark" : ""}`}>
            <div className="min-h-screen px-4 py-10 flex flex-col items-center bg-gradient-to-br from-orange-50 to-white dark:from-neutral-900 dark:to-neutral-800 transition-colors duration-300">
                <div className="w-full max-w-4xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-xl p-8 space-y-8">
                    <h1 className="text-3xl font-extrabold text-center tracking-tight text-neutral-800 dark:text-white">
                        📄 Smart Document Viewer
                    </h1>

                    <div className="space-y-6">
                        {/* Drag & Drop Area */}
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
                                onChange={handleFileChange}
                            />
                            <label
                                htmlFor="fileUpload"
                                className="px-4 py-1 bg-orange-500 hover:bg-orange-600 text-white shadow-md transition duration-300"
                            >
                                Choose Files
                            </label>
                        </div>
                        <p className="text-center text-neutral-700 dark:text-neutral-300">or</p>
                        {/* URL input */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                                Or enter a document URL
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="https://example.com/file.pdf"
                                    value={inputUrl}
                                    onChange={(e) => setInputUrl(e.target.value)}
                                    className="flex-grow px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                                />
                                <button
                                    onClick={handleUrlView}
                                    className="px-5 py-2 bg-orange-600 text-white hover:bg-orange-700 transition"
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Viewer */}
                    {fileUrl && (
                        <div className="mt-6 border border-neutral-300 dark:border-neutral-700 rounded-xl overflow-hidden h-[75vh] shadow-inner">
                            <DocumentViewer url={fileUrl} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentPage;
