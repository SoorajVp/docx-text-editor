import React from 'react'
import { Link } from 'react-router-dom'
import { IoIosDocument } from 'react-icons/io'
import { FaFilePdf, FaFilePowerpoint, FaFileWord } from 'react-icons/fa'
import { IoTimeOutline } from 'react-icons/io5'
import { formatDate, GetFileExtension, getFileSizeInMB, getFileNameOG } from '../../utils/helper'

/* ── File icon ── */
const FileIcon = ({ mimeType, size = 34 }) => {
    const ext = GetFileExtension(mimeType)
    if (ext === 'pdf')  return <FaFilePdf        size={size} className="text-red-500 flex-shrink-0"    />
    if (ext === 'pptx') return <FaFilePowerpoint  size={size} className="text-orange-500 flex-shrink-0" />
    if (ext === 'docx') return <FaFileWord        size={size} className="text-blue-500 flex-shrink-0"   />
    return <IoIosDocument size={size} className="text-gray-400 flex-shrink-0" />
}

/* ── Skeletons ── */
const RowSkeleton = () => (
    <li className="flex items-center gap-3 px-4 py-3 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 animate-pulse">
        <div className="w-8 h-8 rounded bg-neutral-300 dark:bg-neutral-700 flex-shrink-0" />
        <div className="flex-1 space-y-2">
            <div className="h-3 w-48 bg-neutral-300 dark:bg-neutral-700 rounded" />
            <div className="h-2.5 w-32 bg-neutral-200 dark:bg-neutral-800 rounded" />
        </div>
        <div className="h-2.5 w-24 bg-neutral-200 dark:bg-neutral-800 rounded hidden sm:block" />
    </li>
)

const GridSkeleton = () => (
    <li className="rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 h-44 animate-pulse" />
)

/* ── Empty state ── */
const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full py-20 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
            <IoIosDocument size={36} className="text-gray-400 dark:text-neutral-500" />
        </div>
        <div>
            <p className="text-base font-medium text-gray-700 dark:text-gray-300">No documents found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Upload or create a document to get started.
            </p>
        </div>
    </div>
)

/* ── Main component ── */
const DocumentList = ({ documents, listType, loading }) => {
    if (!loading && documents?.length === 0) {
        return <EmptyState />
    }

    /* ── Row view ── */
    if (listType === 'row') {
        return (
            <ul className="flex-1 overflow-y-auto space-y-1.5 no-scrollbar pb-4">
                {loading
                    ? Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)
                    : documents?.map((item) => (
                        <Link
                            to={`/doc/view/${item._id}`}
                            key={item._id}
                            className="flex items-center justify-between gap-3 px-4 py-3 rounded border
                                border-neutral-200 dark:border-neutral-800
                                hover:border-orange-400 dark:hover:border-orange-600
                                bg-neutral-100 dark:bg-neutral-900
                                hover:bg-white dark:hover:bg-neutral-800
                                shadow-sm transition duration-200 ease-in-out"
                        >
                            {/* Left */}
                            <div className="flex items-center gap-3 min-w-0">
                                <FileIcon mimeType={item.mime_type} size={32} />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[280px]">
                                        {item.file_name}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">
                                        {getFileSizeInMB(item.size)}
                                        <span className="mx-1.5">·</span>
                                        Created {formatDate(item.createdAt)}
                                    </p>
                                </div>
                            </div>

                            {/* Right */}
                            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 dark:text-neutral-500 flex-shrink-0">
                                <IoTimeOutline size={13} />
                                Modified {formatDate(item.updatedAt)}
                            </div>
                        </Link>
                    ))}
            </ul>
        )
    }

    /* ── Grid view ── */
    return (
        <ul className="flex-1 overflow-y-auto no-scrollbar pb-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 content-start">
            {loading
                ? Array.from({ length: 12 }).map((_, i) => <GridSkeleton key={i} />)
                : documents?.map((item) => (
                    <Link
                        to={`/doc/view/${item._id}`}
                        key={item._id}
                        className="flex flex-col items-center text-center rounded border gap-2
                            border-neutral-200 dark:border-neutral-800
                            hover:border-orange-400 dark:hover:border-orange-600
                            bg-neutral-100 dark:bg-neutral-900
                            hover:bg-white dark:hover:bg-neutral-800
                            p-4 shadow-sm transition duration-200 ease-in-out"
                    >
                        <FileIcon mimeType={item.mime_type} size={44} />
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate w-full">
                            {getFileNameOG(item.file_name)}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-neutral-500">
                            {getFileSizeInMB(item.size)}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-neutral-500">
                            <IoTimeOutline size={11} />
                            {formatDate(item.updatedAt)}
                        </div>
                    </Link>
                ))}
        </ul>
    )
}

export default DocumentList
