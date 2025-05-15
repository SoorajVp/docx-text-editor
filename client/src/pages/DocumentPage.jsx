import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import DocViewer  from "@cyntler/react-doc-viewer";
import { Document, Page } from 'react-pdf';

const DocumentPage = () => {
    const [fileUrl, setFileUrl] = useState(null);
    const [inputUrl, setInputUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [numPages, setNumPages] = useState(null);
    const fileInputRef = useRef();
    const { darkMode } = useSelector((store) => store.user);

    const supportedDocs = [
        { fileName: 'Document', uri: '' } // Placeholder, will be replaced
    ];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'text/plain',
                'image/jpeg',
                'image/png'
            ];

            if (!validTypes.includes(file.type)) {
                setError('Unsupported file type. Please upload a document, spreadsheet, presentation, PDF, or image.');
                return;
            }

            setError(null);
            setIsLoading(true);

            // Create object URL for the file
            const fileObjectUrl = URL.createObjectURL(file);

            setSelectedFile({
                file,
                url: fileObjectUrl,
                fileName: file.name,
                fileType: file.type
            });
            setFileUrl(null);
            setInputUrl("");
            setIsLoading(false);
        }
    };

    const handleUrlView = () => {
        if (!inputUrl) {
            setError('Please enter a valid URL');
            return;
        }

        // Basic URL validation
        try {
            new URL(inputUrl);
        } catch (e) {
            setError('Please enter a valid URL');
            return;
        }

        setError(null);
        setIsLoading(true);

        // Check if URL points to a supported document
        const supportedExtensions = [
            '.pdf', '.doc', '.docx', '.txt',
            '.xls', '.xlsx', '.ppt', '.pptx',
            '.jpg', '.jpeg', '.png'
        ];
        const hasValidExtension = supportedExtensions.some(ext =>
            inputUrl.toLowerCase().endsWith(ext)
        );

        if (!hasValidExtension) {
            setError('URL must point to a supported document format');
            setIsLoading(false);
            return;
        }

        setFileUrl(inputUrl);
        setSelectedFile(null);
        setIsLoading(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            // Simulate file input change
            const event = {
                target: {
                    files: [file]
                }
            };
            handleFileChange(event);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    // Clean up object URLs when component unmounts
    useEffect(() => {
        return () => {
            if (selectedFile?.url) {
                URL.revokeObjectURL(selectedFile.url);
            }
        };
    }, [selectedFile]);

    const docs = [
        {
            uri: fileUrl || selectedFile?.url,
            fileName: selectedFile?.fileName || "Document",
            fileType: selectedFile?.fileType || "application/pdf"
        }
    ];

    return (
        <div className={`min-h-screen ${darkMode === "true" ? "dark" : ""}`}>
            <div className="min-h-screen px-4 py-10 flex items-center justify-center bg-gradient-to-br from-orange-50 to-white dark:from-neutral-900 dark:to-neutral-800 transition-colors duration-300">
                <div className="w-full max-w-4xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-xl p-8 space-y-8">
                    <h1 className="text-3xl font-extrabold text-center tracking-tight text-neutral-800 dark:text-white">
                        📄 Smart Document Viewer
                    </h1>

                    <div className="space-y-3">
                        {/* Drag & Drop Area */}
                        <div
                            className={`border-2 border-dashed ${error ? 'border-red-500' : 'border-orange-400'} bg-neutral-100 dark:bg-neutral-800 p-6 flex flex-col items-center justify-center space-y-4 cursor-pointer`}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                            />
                            <p className="text-center text-gray-700 dark:text-gray-300">
                                Drag and drop your files here, or click to select
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Supported formats: PDF, Word, Excel, PowerPoint, Images
                            </p>
                        </div>
                        <p className="text-center text-neutral-700 dark:text-neutral-300">or</p>
                        {/* URL input */}
                        <div>
                            <label className="block text-center text-sm font-medium mb-2 text-neutral-500 ">
                                Enter a document URL
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="https://example.com/document.pdf"
                                    value={inputUrl}
                                    onChange={(e) => {
                                        setInputUrl(e.target.value);
                                        setError(null);
                                    }}
                                    className="flex-grow px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-orange-500 transition"
                                    onKeyPress={(e) => e.key === 'Enter' && handleUrlView()}
                                />
                            </div>
                            <button
                                onClick={handleUrlView}
                                disabled={isLoading}
                                className={`mt-3 px-5 py-2 w-full bg-orange-600 text-white hover:bg-orange-700 transition ease-in-out duration-500 rounded-md border ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Loading...' : 'View'}
                            </button>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="mt-2 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Viewer */}
                    {(fileUrl || selectedFile) && !isLoading && (
                        <div className="mt-6 border border-neutral-300 dark:border-neutral-700 rounded-xl overflow-hidden h-[75vh] shadow-inner">
                            <div className="h-full w-full">
                                <DocViewer
                                    documents={docs}
                                    config={{
                                        header: {
                                            disableHeader: false,
                                            disableFileName: false,
                                            retainURLParams: false
                                        },
                                        loadingRenderer: {
                                            overrideComponent: () => (
                                                <div className="flex items-center justify-center h-full">
                                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                                                </div>
                                            )
                                        },
                                        noRenderer: {
                                            overrideComponent: ({ document, fileName }) => (
                                                <div className="flex items-center justify-center h-full">
                                                    <div className="text-center p-4">
                                                        <p className="text-lg font-medium text-neutral-700 dark:text-neutral-300">
                                                            Cannot display {fileName}
                                                        </p>
                                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                                            The document format is not supported for preview.
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    }}
                                    theme={darkMode === "true" ? "dark" : "light"}
                                    style={{ height: '100%' }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentPage;