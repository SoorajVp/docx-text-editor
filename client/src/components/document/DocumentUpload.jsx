import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { IoCloseSharp, IoCloudUploadOutline, IoDocumentOutline, IoCheckmarkCircle } from "react-icons/io5";
import { FaFilePdf, FaFilePowerpoint, FaFileWord } from "react-icons/fa";
import { MdOutlineChangeCircle } from "react-icons/md";
import DocumentPreview from "./DocPreview";

const VALID_TYPES = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/pdf",
];

const EXT_MAP = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
};

const FileTypeIcon = ({ type, size = 48 }) => {
    if (type === "pdf")  return <FaFilePdf        size={size} className="text-red-500"    />;
    if (type === "pptx") return <FaFilePowerpoint  size={size} className="text-orange-500" />;
    if (type === "docx") return <FaFileWord        size={size} className="text-blue-500"   />;
    return <IoDocumentOutline size={size} className="text-gray-400" />;
};

const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

const DocumentUpload = ({ onSubmit }) => {
    const [file, setFile]       = useState(null);
    const [fileURL, setFileURL] = useState(null);
    const [error, setError]     = useState("");
    const [dragging, setDragging] = useState(false);

    const ext = fileURL ? EXT_MAP[file?.type] : null;

    const validateFile = (f) => {
        if (fileURL?.url) URL.revokeObjectURL(fileURL.url);
        if (f && VALID_TYPES.includes(f.type)) {
            setFile(f);
            setError("");
            setFileURL({ url: URL.createObjectURL(f), name: f.name, type: EXT_MAP[f.type] });
        } else {
            setFile(null);
            setFileURL(null);
            setError("Invalid file type. Please upload a .docx, .pptx, or .pdf file.");
        }
    };

    const removeFile = () => {
        if (fileURL?.url) URL.revokeObjectURL(fileURL.url);
        setFile(null);
        setFileURL(null);
        setError("");
    };

    const handleDragOver  = (e) => { e.preventDefault(); setDragging(true);  };
    const handleDragLeave = (e) => { e.preventDefault(); setDragging(false); };
    const handleDrop      = (e) => {
        e.preventDefault();
        setDragging(false);
        validateFile(Array.from(e.dataTransfer.files)[0]);
    };
    const handleFileInput = (e) => validateFile(Array.from(e.target.files)[0]);

    /* ── Drop zone (no file selected) ── */
    if (!file) {
        return (
            <div className="h-full w-full flex items-center justify-center px-4">
                <div className="w-full max-w-xl">

                    {/* Title */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Upload a Document
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Drag and drop or choose a file to get started.
                        </p>
                    </div>

                    {/* Drop zone */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`relative flex flex-col items-center justify-center gap-4 px-8 py-14 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer
                            ${dragging
                                ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                                : "border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 hover:border-orange-400 dark:hover:border-orange-600 hover:bg-orange-50/50 dark:hover:bg-orange-950/10"
                            }`}
                    >
                        <div className={`p-4 rounded-full transition-colors ${dragging ? "bg-orange-100 dark:bg-orange-900/40" : "bg-gray-100 dark:bg-neutral-800"}`}>
                            <IoCloudUploadOutline
                                size={40}
                                className={dragging ? "text-orange-500" : "text-gray-400 dark:text-neutral-500"}
                            />
                        </div>

                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {dragging ? "Drop your file here" : "Drag & drop your file here"}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">or</p>
                        </div>

                        <input
                            type="file"
                            id="fileUpload"
                            className="hidden"
                            accept=".pdf,.docx,.pptx"
                            onChange={handleFileInput}
                        />
                        <label
                            htmlFor="fileUpload"
                            className="px-5 py-2 text-sm font-medium rounded cursor-pointer transition
                                bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700"
                        >
                            Browse Files
                        </label>

                        {/* Accepted formats */}
                        <div className="flex items-center gap-2 mt-1">
                            <span className="flex items-center gap-1 text-xs text-neutral-400 border border-neutral-400 px-2 py-0.5 rounded-full">
                                <FaFileWord size={10} /> DOCX
                            </span>
                            <span className="flex items-center gap-1 text-xs text-neutral-400 border border-neutral-400 px-2 py-0.5 rounded-full">
                                <FaFilePowerpoint size={10} /> PPTX
                            </span>
                            <span className="flex items-center gap-1 text-xs text-neutral-400 border border-neutral-400 px-2 py-0.5 rounded-full">
                                <FaFilePdf size={10} /> PDF
                            </span>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-red-500 dark:text-red-400 text-xs mt-3 text-center">{error}</p>
                    )}
                </div>
            </div>
        );
    }

    /* ── File selected ── */
    return (
        <div className="h-full w-full flex flex-col max-w-4xl mx-auto px-2 pt-2 gap-2">

            {/* ── Action bar ── */}
            <div className="flex items-center gap-2 flex-shrink-0">

                {/* File info chip */}
                <div className="flex items-center gap-2.5 flex-1 min-w-0 px-3 py-2 rounded border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900">
                    <FileTypeIcon type={ext} size={20} />
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                            {file.name}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-neutral-500">
                            {formatSize(file.size)} · {ext?.toUpperCase()}
                        </p>
                    </div>
                    <IoCheckmarkCircle size={18} className="text-green-500 flex-shrink-0" />
                    <button
                        onClick={removeFile}
                        title="Remove file"
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition flex-shrink-0"
                    >
                        <IoCloseSharp size={16} />
                    </button>
                </div>

                {/* Change file */}
                <input
                    type="file"
                    id="fileUpload"
                    className="hidden"
                    accept=".pdf,.docx,.pptx"
                    onChange={handleFileInput}
                />
                <label
                    htmlFor="fileUpload"
                    className="flex items-center gap-1.5 px-3 py-2 text-sm rounded cursor-pointer flex-shrink-0 transition
                        border border-gray-300 dark:border-neutral-700
                        text-gray-600 dark:text-gray-300
                        hover:border-orange-400 hover:text-orange-600
                        dark:hover:border-orange-500 dark:hover:text-orange-400"
                >
                    <MdOutlineChangeCircle size={16} />
                    <span className="hidden sm:inline">Change</span>
                </label>

                {/* Submit */}
                <button
                    onClick={() => onSubmit(file)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm rounded font-medium flex-shrink-0 transition
                        bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700"
                >
                    <IoCloudUploadOutline size={16} />
                    <span>Upload</span>
                </button>
            </div>

            {/* ── Preview ── */}
            <div className="flex-1 min-h-0 rounded border border-gray-200 dark:border-neutral-800 overflow-hidden">
                {ext === "pdf" ? (
                    <DocumentPreview file={fileURL} />
                ) : (
                    /* No preview for docx / pptx */
                    <div className="h-full flex flex-col items-center justify-center gap-5 bg-gray-50 dark:bg-neutral-900">
                        <FileTypeIcon type={ext} size={64} />
                        <div className="text-center">
                            <p className="text-base font-medium text-gray-800 dark:text-gray-100">
                                {ext?.toUpperCase()} — Preview not available
                            </p>
                            <p className="text-sm text-gray-400 dark:text-neutral-500 mt-1 max-w-xs">
                                Your file is ready to upload. Click <strong>Upload</strong> to continue.
                            </p>
                        </div>

                        {/* File meta card */}
                        <div className="flex items-center gap-4 px-6 py-3 rounded border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
                            <FileTypeIcon type={ext} size={28} />
                            <div>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                    {file.name}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">
                                    {formatSize(file.size)}
                                </p>
                            </div>
                            <IoCheckmarkCircle size={22} className="text-green-500 ml-2" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentUpload;
