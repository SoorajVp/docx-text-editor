import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { MdViewList } from "react-icons/md";
import { PiGridNineFill } from "react-icons/pi";
import { IoIosDocument } from "react-icons/io";
import { RiEditFill } from "react-icons/ri";
import { IoEyeOutline, IoTimeOutline } from "react-icons/io5";
import { FaFilePdf, FaFilePowerpoint, FaFileWord } from "react-icons/fa";
import accessService from "../api/services/access";
import { formatDate, GetFileExtension, getFileSizeInMB, getFileNameOG } from "../utils/helper";

/* ── File icon by type ── */
const FileIcon = ({ mimeType, size = 36 }) => {
    const ext = GetFileExtension(mimeType);
    if (ext === "pdf")  return <FaFilePdf       size={size} className="text-red-500"    />;
    if (ext === "pptx") return <FaFilePowerpoint size={size} className="text-orange-500" />;
    if (ext === "docx") return <FaFileWord       size={size} className="text-blue-500"   />;
    return <IoIosDocument size={size} className="text-gray-400" />;
};

/* ── Permission badge ── */
const PermissionBadge = ({ permission }) =>
    permission === "write" ? (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold
            bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300
            border border-orange-200 dark:border-orange-800">
            <RiEditFill size={10} /> Can Edit
        </span>
    ) : (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold
            bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-gray-400
            border border-gray-200 dark:border-neutral-700">
            <IoEyeOutline size={10} /> Read Only
        </span>
    );

/* ── Owner avatar ── */
const OwnerAvatar = ({ name, picture }) => {
    const [imgError, setImgError] = useState(false);
    return picture && !imgError ? (
        <img
            src={picture}
            alt={name}
            onError={() => setImgError(true)}
            className="w-5 h-5 rounded-full object-cover flex-shrink-0"
        />
    ) : (
        <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-600 dark:text-orange-300 text-xs font-semibold flex-shrink-0">
            {name?.[0]?.toUpperCase() ?? "?"}
        </div>
    );
};

/* ── Row skeleton ── */
const RowSkeleton = () => (
    <li className="rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-black h-16 animate-pulse" />
);

/* ── Grid skeleton ── */
const GridSkeleton = () => (
    <li className="rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-black h-40 animate-pulse" />
);

/* ── Empty state ── */
const EmptyState = ({ filtered }) => (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-20">
        <div className="w-16 h-16 rounded-full bg-gray-100  dark:text-white text-neutral-950 dark:bg-neutral-800 flex items-center justify-center text-3xl">
           <IoIosDocument size={40} />
        </div>
        <div>
            <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                {filtered ? "No matching documents" : "No shared documents yet"}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                {filtered
                    ? "Try a different search term."
                    : "Documents shared with you will appear here."}
            </p>
        </div>
    </div>
);

/* ── Main page ── */
const SharedFiles = () => {
    const [sharedFiles, setSharedFiles]   = useState([]);
    const [filtered, setFiltered]         = useState([]);
    const [loading, setLoading]           = useState(true);
    const [search, setSearch]             = useState("");
    const [listType, setListType]         = useState("row");
    const debounceRef = useRef(null);

    /* fetch on mount */
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await accessService.GetSharedFileList();
                setSharedFiles(res?.sharedFiles || []);
                setFiltered(res?.sharedFiles || []);
            } catch {
                setSharedFiles([]);
                setFiltered([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    /* client-side search with debounce */
    useEffect(() => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            const q = search.trim().toLowerCase();
            setFiltered(
                q
                    ? sharedFiles.filter((f) =>
                          f.documentId?.file_name?.toLowerCase().includes(q) ||
                          f.ownerId?.name?.toLowerCase().includes(q)
                      )
                    : sharedFiles
            );
        }, 300);
        return () => clearTimeout(debounceRef.current);
    }, [search, sharedFiles]);

    const isEmpty = !loading && filtered.length === 0;

    return (
        <div className="max-w-5xl mx-auto h-[91vh] px-2 pt-2 flex flex-col">

            {/* ── Toolbar ── */}
            <div className="flex justify-between items-center">
                <div className="relative w-64">
                    <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search shared files…"
                        className="w-full pl-10 pr-3 py-1.5 text-sm rounded
                            bg-white dark:bg-black
                            text-black dark:text-neutral-200
                            border border-gray-400 dark:border-gray-700
                            focus:border-orange-500 dark:focus:border-orange-300
                            outline-none transition duration-300"
                    />
                </div>

                {/* View toggle */}
                <div className="flex items-center gap-1 text-gray-500">
                    {listType === "row" ? (
                        <PiGridNineFill
                            size={25}
                            onClick={() => setListType("col")}
                            className="cursor-pointer text-gray-700 dark:text-gray-300"
                            title="Grid view"
                        />
                    ) : (
                        <MdViewList
                            size={25}
                            onClick={() => setListType("row")}
                            className="cursor-pointer text-gray-700 dark:text-gray-300"
                            title="List view"
                        />
                    )}
                </div>
            </div>

            {/* ── Count ── */}
            <p className="text-neutral-700 dark:text-neutral-400 text-xs py-1.5">
                {loading
                    ? "Loading shared documents…"
                    : `Showing ${filtered.length} shared document${filtered.length !== 1 ? "s" : ""}`}
            </p>

            {/* ── List ── */}
            <div className="flex-1 overflow-y-auto no-scrollbar">

                {/* Row view */}
                {listType === "row" && (
                    <ul className="space-y-2">
                        {loading
                            ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
                            : isEmpty
                            ? <EmptyState filtered={!!search.trim()} />
                            : filtered.map((item) => (
                                <Link
                                    key={item._id}
                                    to={`/shared/${item._id}?doc=${item.documentId?._id}`}
                                    className="flex justify-between items-center rounded border
                                        border-neutral-300 dark:border-neutral-700
                                        hover:border-orange-400 dark:hover:border-orange-600
                                        bg-neutral-100 dark:bg-black
                                        px-4 py-3 shadow-sm transition duration-300 ease-in-out"
                                >
                                    {/* Left */}
                                    <div className="flex items-center gap-3 min-w-0">
                                        <FileIcon mimeType={item.documentId?.mime_type} size={32} />
                                        <div className="min-w-0">
                                            <p className="text-gray-900 dark:text-gray-100 text-sm font-medium truncate max-w-[260px]">
                                                {item.documentId?.file_name ?? "Untitled"}
                                            </p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <OwnerAvatar
                                                    name={item.ownerId?.name}
                                                    picture={item.ownerId?.picture}
                                                />
                                                <span className="text-neutral-500 text-xs truncate">
                                                    {item.ownerId?.name ?? "Unknown"}
                                                </span>
                                                <span className="text-neutral-400 dark:text-neutral-600 text-xs">·</span>
                                                <span className="text-neutral-500 text-xs">
                                                    {getFileSizeInMB(item.documentId?.size)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right */}
                                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                                        <PermissionBadge permission={item.permission} />
                                        <div className="hidden sm:flex items-center gap-1 text-neutral-500 text-xs">
                                            <IoTimeOutline size={12} />
                                            {formatDate(item.createdAt)}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                    </ul>
                )}

                {/* Grid view */}
                {listType === "col" && (
                    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {loading
                            ? Array.from({ length: 8 }).map((_, i) => <GridSkeleton key={i} />)
                            : isEmpty
                            ? <li className="col-span-4"><EmptyState filtered={!!search.trim()} /></li>
                            : filtered.map((item) => (
                                <Link
                                    key={item._id}
                                    to={`/shared/${item._id}`}
                                    className="flex flex-col items-center text-center rounded border
                                        border-neutral-300 dark:border-neutral-700
                                        hover:border-orange-400 dark:hover:border-orange-600
                                        bg-neutral-100 dark:bg-black
                                        p-4 shadow-sm transition duration-300 ease-in-out gap-2"
                                >
                                    <FileIcon mimeType={item.documentId?.mime_type} size={48} />

                                    <p className="text-gray-900 dark:text-gray-100 text-sm font-medium truncate w-full">
                                        {getFileNameOG(item.documentId?.file_name) ?? "Untitled"}
                                    </p>

                                    <PermissionBadge permission={item.permission} />

                                    <div className="flex items-center gap-1.5 justify-center">
                                        <OwnerAvatar
                                            name={item.ownerId?.name}
                                            picture={item.ownerId?.picture}
                                        />
                                        <span className="text-neutral-500 text-xs truncate max-w-[80px]">
                                            {item.ownerId?.name ?? "Unknown"}
                                        </span>
                                    </div>

                                    <p className="text-neutral-400 dark:text-neutral-500 text-xs">
                                        {formatDate(item.createdAt)}
                                    </p>
                                </Link>
                            ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SharedFiles;
