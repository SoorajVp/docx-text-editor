import React, { useState, useRef, useEffect } from "react";
import { CiSearch } from "react-icons/ci";

const ShareModal = ({ onClose, onShare, searchUsers }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const dropdownRef = useRef(null);

    // 🔍 Search Users
    const handleSearch = async (value) => {
        setQuery(value);

        if (!value.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const res = await searchUsers(value);
            setResults(res);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    // ➕ Add user
    const addUser = (user) => {
        if (selectedUsers.find((u) => u._id === user._id)) return;

        setSelectedUsers((prev) => [
            ...prev,
            { ...user, permission: "read" },
        ]);
        setQuery("");
        setResults([]);
    };

    // ❌ Remove user
    const removeUser = (id) => {
        setSelectedUsers((prev) => prev.filter((u) => u._id !== id));
    };

    // 🔄 Change permission
    const updatePermission = (id, permission) => {
        setSelectedUsers((prev) =>
            prev.map((u) =>
                u._id === id ? { ...u, permission } : u
            )
        );
    };

    // 🚀 Submit
    const handleSubmit = () => {
        onShare(selectedUsers);
    };

    // 📌 Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setResults([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-neutral-900 p-6 shadow-2xl w-full max-w-md">

                {/* Header */}
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Share Document
                </h2>

                {/* 🔍 Search */}
                <div className="relative" ref={dropdownRef}>
                    <CiSearch
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                        size={20}
                    />

                    <input
                        type="text"
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search users..."
                        className="w-full pl-10 pr-3 py-1.5 text-sm
            bg-white dark:bg-neutral-900
            text-gray-900 dark:text-neutral-200
            border border-gray-300 dark:border-neutral-700
            focus:border-orange-500 dark:focus:border-orange-400
            focus:ring-1 focus:ring-orange-500 dark:focus:ring-orange-400
            outline-none transition-all duration-200"
                    />

                    {/* Search Results */}
                    {results.length > 0 && (
                        <div className="absolute w-full mt-1 bg-white dark:bg-neutral-900 
            border border-gray-300 dark:border-neutral-700 shadow-lg z-50 max-h-40 overflow-y-auto">

                            {results.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => addUser(user)}
                                    className="px-3 py-2 text-sm cursor-pointer
                  text-gray-700 dark:text-gray-200
                  hover:bg-orange-100 dark:hover:bg-orange-600
                  hover:text-black dark:hover:text-white transition"
                                >
                                    {user.name} ({user.email})
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Loading */}
                {loading && (
                    <p className="text-xs text-gray-500 mt-2">Searching...</p>
                )}

                {/* 👥 Selected Users */}
                {selectedUsers.length > 0 && (
                    <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                        {selectedUsers.map((user) => (
                            <div
                                key={user._id}
                                className="flex items-center justify-between px-3 py-2
                bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700"
                            >
                                <div>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {user.email}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Permission */}
                                    <select
                                        value={user.permission}
                                        onChange={(e) =>
                                            updatePermission(user._id, e.target.value)
                                        }
                                        className="text-xs px-2 py-1
                    bg-white dark:bg-neutral-900
                    border border-gray-300 dark:border-neutral-600
                    text-gray-800 dark:text-gray-200"
                                    >
                                        <option value="read">View</option>
                                        <option value="write">Edit</option>
                                    </select>

                                    {/* Remove */}
                                    <button
                                        onClick={() => removeUser(user._id)}
                                        className="text-red-500 hover:text-red-600 text-sm"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 text-sm
            bg-gray-300 dark:bg-neutral-700
            text-gray-800 dark:text-white"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={selectedUsers.length === 0}
                        className="px-4 py-1.5 text-sm
            bg-orange-500 text-white
            hover:bg-orange-600
            disabled:opacity-50 transition"
                    >
                        Share
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;