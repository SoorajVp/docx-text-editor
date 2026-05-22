import React, { useState, useRef, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { IoClose, IoLinkOutline, IoEarthOutline, IoLockClosedOutline, IoCheckmark } from "react-icons/io5";
import { RiEditFill } from "react-icons/ri";
import { IoEyeOutline } from "react-icons/io5";
import { MdContentCopy } from "react-icons/md";
import userService from "../../api/services/user";
import accessService from "../../api/services/access";

const ShareModal = ({ onClose, onShare, documentId }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [linkAccess, setLinkAccess] = useState("restricted");
    const [permission, setPermission] = useState("view");
    const [copied, setCopied] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [sharedUrl, setSharedUrl] = useState(null);
    const [existingAccess, setExistingAccess] = useState([]);
    const [accessLoading, setAccessLoading] = useState(true);

    const dropdownRef = useRef(null);
    const debounceRef = useRef(null);
    const documentLink = sharedUrl ?? `${window.location.origin}/doc/view/${documentId}`;

    /* ── Load existing access on open ── */
    useEffect(() => {
        const load = async () => {
            setAccessLoading(true);
            try {
                const res = await accessService.GetDocumentAccessList(documentId);
                setExistingAccess(res?.accessList || []);
            } catch {
                setExistingAccess([]);
            } finally {
                setAccessLoading(false);
            }
        };
        load();
    }, [documentId]);

    /* ── Search ── */
    const fetchUsers = async (value) => {
        setLoading(true);
        try {
            const res = await userService.GetUserList(value);
            setResults(res?.users || []);
        } catch {
            setResults([]);
        }
        setLoading(false);
    };

    const handleSearch = (value) => {
        setQuery(value);
        clearTimeout(debounceRef.current);
        if (!value.trim()) { setResults([]); setLoading(false); return; }
        setLoading(true);
        debounceRef.current = setTimeout(() => fetchUsers(value), 400);
    };

    useEffect(() => () => clearTimeout(debounceRef.current), []);

    /* ── Users ── */
    const addUser = (user) => {
        if (selectedUsers.find((u) => u._id === user._id)) return;
        setSelectedUsers((prev) => [...prev, user]);
        setQuery("");
        setResults([]);
    };

    const removeUser = (id) => setSelectedUsers((prev) => prev.filter((u) => u._id !== id));

    /* ── Copy link ── */
    const handleCopyLink = () => {
        navigator.clipboard.writeText(documentLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    /* ── Submit ── */
    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const payload = {
                doc_id: documentId,
                emails: selectedUsers.map((u) => u.email),
                mode: permission === "edit" ? "write" : "read",
                is_public: linkAccess === "anyone",
            };
            const response = await accessService.sendAccessInvitation(payload);
            if (response?.url) setSharedUrl(response.url);
            // Refresh existing access list
            const fresh = await accessService.GetDocumentAccessList(documentId);
            setExistingAccess(fresh?.accessList || []);
            setSelectedUsers([]);
        } catch (error) {
            console.error("Share failed:", error);
        } finally {
            setSubmitting(false);
        }
    };

    /* ── Outside click closes search dropdown ── */
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target))
                setResults([]);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    /* ── Avatar ── */
    const Avatar = ({ name, picture, size = "w-7 h-7" }) => {
        const [imgError, setImgError] = useState(false);
        return picture && !imgError
            ? <img src={picture} alt={name} onError={() => setImgError(true)} className={`${size} rounded-full object-cover flex-shrink-0`} />
            : <div className={`${size} rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-600 dark:text-orange-300 text-xs font-semibold flex-shrink-0`}>
                {name?.[0]?.toUpperCase() ?? "?"}
              </div>;
    };

    const PermissionBadge = ({ permission }) =>
        permission === "write" ? (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                <RiEditFill size={10} /> Can edit
            </span>
        ) : (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-neutral-700">
                <IoEyeOutline size={10} /> View only
            </span>
        );

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white dark:bg-neutral-900 rounded shadow-2xl w-full max-w-lg border border-gray-200 dark:border-neutral-700 overflow-hidden">

                {/* ── Header ── */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-neutral-800">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">Share document</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                    >
                        <IoClose size={18} />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-4">

                    {/* ── Search + permission ── */}
                    <div className="w-full">
                        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                            Add people
                        </p>
                        <div className="flex gap-2 items-center w-full">
                            <div className="relative flex-1" ref={dropdownRef}>
                                <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={query}
                                    autoComplete="off"
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Search by name or email..."
                                    className="w-full pl-9 pr-4 py-2 text-sm rounded
                                        bg-gray-50 dark:bg-neutral-800
                                        text-gray-900 dark:text-neutral-100
                                        border border-gray-200 dark:border-neutral-700
                                        focus:border-orange-500 dark:focus:border-orange-400
                                        focus:ring-2 focus:ring-orange-500/20
                                        outline-none transition-all"
                                />
                                {loading && (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                                        Searching…
                                    </span>
                                )}

                                {/* Search dropdown */}
                                {results.length > 0 && (
                                    <div className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-xl z-50 max-h-44 overflow-y-auto">
                                        {results.map((user) => (
                                            <div
                                                key={user._id}
                                                onClick={() => addUser(user)}
                                                className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-orange-50 dark:hover:bg-neutral-700 transition"
                                            >
                                                <Avatar name={user.name} picture={user.picture} size="w-6 h-6" />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{user.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                                </div>
                                                {selectedUsers.find((u) => u._id === user._id) && (
                                                    <IoCheckmark size={15} className="ml-auto text-orange-500 flex-shrink-0" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <select
                                value={permission}
                                onChange={(e) => setPermission(e.target.value)}
                                className="text-xs font-medium px-2 py-2 rounded cursor-pointer outline-none flex-shrink-0
                                    bg-white dark:bg-neutral-700
                                    border border-gray-200 dark:border-neutral-600
                                    text-gray-700 dark:text-gray-200
                                    focus:border-orange-400"
                            >
                                <option value="view">View</option>
                                <option value="edit">Edit</option>
                            </select>
                        </div>
                    </div>

                    {/* ── Pending pills (newly selected) ── */}
                    {selectedUsers.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {selectedUsers.map((user) => (
                                <span
                                    key={user._id}
                                    className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-full
                                        bg-orange-50 dark:bg-orange-950/30
                                        border border-orange-200 dark:border-orange-800
                                        text-orange-700 dark:text-orange-300 text-xs"
                                >
                                    <Avatar name={user.name} picture={user.picture} size="w-5 h-5" />
                                    <span className="max-w-[100px] truncate">{user.name}</span>
                                    <button
                                        onClick={() => removeUser(user._id)}
                                        className="ml-0.5 text-orange-400 hover:text-orange-600 dark:hover:text-orange-200 transition"
                                    >
                                        <IoClose size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* ── Existing access list ── */}
                    {(accessLoading || existingAccess.length > 0) && (
                        <>
                            <div className="border-t border-gray-100 dark:border-neutral-800" />
                            <div>
                                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                                    People with access
                                </p>

                                {accessLoading ? (
                                    <div className="space-y-2">
                                        {[1, 2].map((i) => (
                                            <div key={i} className="flex items-center gap-3 animate-pulse">
                                                <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-neutral-700 flex-shrink-0" />
                                                <div className="flex-1 space-y-1.5">
                                                    <div className="h-3 w-32 bg-gray-200 dark:bg-neutral-700 rounded" />
                                                    <div className="h-2.5 w-44 bg-gray-100 dark:bg-neutral-800 rounded" />
                                                </div>
                                                <div className="h-5 w-16 bg-gray-100 dark:bg-neutral-800 rounded" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <ul className="space-y-2 max-h-40 overflow-y-auto pr-0.5">
                                        {existingAccess.map((item) => (
                                            <li key={item._id} className="flex items-center gap-3">
                                                <Avatar
                                                    name={item.recipientId?.name}
                                                    picture={item.recipientId?.picture}
                                                    size="w-7 h-7"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                                                        {item.recipientId?.name ?? "Unknown"}
                                                    </p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                                                        {item.recipientId?.email}
                                                    </p>
                                                </div>
                                                <PermissionBadge permission={item.permission} />
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </>
                    )}

                    {/* ── Divider ── */}
                    <div className="border-t border-gray-100 dark:border-neutral-800" />

                    {/* ── General Access ── */}
                    <div>
                        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                            General access
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setLinkAccess("restricted")}
                                className={`flex items-center gap-2.5 px-3 py-3 rounded border text-left transition-all
                                    ${linkAccess === "restricted"
                                        ? "border-orange-400 bg-orange-50 dark:bg-orange-950/30"
                                        : "border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600 bg-white dark:bg-neutral-800/50"
                                    }`}
                            >
                                <div className={`p-1.5 rounded-full flex-shrink-0 ${linkAccess === "restricted" ? "bg-orange-100 dark:bg-orange-900/60" : "bg-gray-100 dark:bg-neutral-700"}`}>
                                    <IoLockClosedOutline size={14} className={linkAccess === "restricted" ? "text-orange-600 dark:text-orange-300" : "text-gray-500 dark:text-gray-400"} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${linkAccess === "restricted" ? "text-orange-700 dark:text-orange-300" : "text-gray-700 dark:text-gray-200"}`}>
                                        Restricted
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">Only invited</p>
                                </div>
                                {linkAccess === "restricted" && <IoCheckmark className="text-orange-500 flex-shrink-0" size={16} />}
                            </button>

                            <button
                                onClick={() => setLinkAccess("anyone")}
                                className={`flex items-center gap-2.5 px-3 py-3 rounded border text-left transition-all
                                    ${linkAccess === "anyone"
                                        ? "border-orange-400 bg-orange-50 dark:bg-orange-950/30"
                                        : "border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600 bg-white dark:bg-neutral-800/50"
                                    }`}
                            >
                                <div className={`p-1.5 rounded-full flex-shrink-0 ${linkAccess === "anyone" ? "bg-orange-100 dark:bg-orange-900/60" : "bg-gray-100 dark:bg-neutral-700"}`}>
                                    <IoEarthOutline size={14} className={linkAccess === "anyone" ? "text-orange-600 dark:text-orange-300" : "text-gray-500 dark:text-gray-400"} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${linkAccess === "anyone" ? "text-orange-700 dark:text-orange-300" : "text-gray-700 dark:text-gray-200"}`}>
                                        Anyone
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">With the link</p>
                                </div>
                                {linkAccess === "anyone" && <IoCheckmark className="text-orange-500 flex-shrink-0" size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* ── Copy Link ── */}
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded bg-gray-50 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700">
                        <IoLinkOutline size={15} className="text-gray-400 flex-shrink-0" />
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex-1 font-mono select-all">
                            {documentLink}
                        </p>
                        <button
                            onClick={handleCopyLink}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition flex-shrink-0
                                ${copied
                                    ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                                    : "bg-white dark:bg-neutral-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-neutral-600 hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400"
                                }`}
                        >
                            {copied ? <IoCheckmark size={13} /> : <MdContentCopy size={13} />}
                            {copied ? "Copied!" : "Copy link"}
                        </button>
                    </div>
                </div>

                {/* ── Footer ── */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-neutral-800 bg-gray-50/70 dark:bg-neutral-900/60">
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        {sharedUrl
                            ? <span className="text-green-600 dark:text-green-400 font-medium">Invite sent — link ready to copy</span>
                            : selectedUsers.length > 0
                            ? `${selectedUsers.length} person${selectedUsers.length > 1 ? "s" : ""} selected`
                            : "Search and add people above"}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm rounded text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700 transition"
                        >
                            Close
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || selectedUsers.length === 0}
                            className="flex items-center gap-2 px-5 py-2 text-sm rounded font-medium bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting && (
                                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                            )}
                            {submitting ? "Sending…" : "Send Invite"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
