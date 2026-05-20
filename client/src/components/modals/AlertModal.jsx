import React from "react";
import { IoClose, IoTrashOutline, IoArchiveOutline, IoRefreshOutline, IoWarningOutline, IoLogOutOutline } from "react-icons/io5";

const ACTION_CONFIG = {
    restore: {
        title: "Restore File",
        message: "This file will be moved back to your documents and will be accessible again.",
        icon: IoRefreshOutline,
        iconBg: "bg-green-100 dark:bg-green-900/40",
        iconColor: "text-green-600 dark:text-green-400",
        confirmLabel: "Restore",
        confirmStyle: "bg-orange-500 hover:bg-orange-600 active:bg-orange-700",
    },
    "restore-all": {
        title: "Restore All Files",
        message: "All files in the bin will be restored to your documents. This will clear the bin.",
        icon: IoRefreshOutline,
        iconBg: "bg-green-100 dark:bg-green-900/40",
        iconColor: "text-green-600 dark:text-green-400",
        confirmLabel: "Restore All",
        confirmStyle: "bg-orange-500 hover:bg-orange-600 active:bg-orange-700",
    },
    "restore-selected": {
        title: "Restore Selected Files",
        message: "The selected files will be moved back to your documents.",
        icon: IoRefreshOutline,
        iconBg: "bg-green-100 dark:bg-green-900/40",
        iconColor: "text-green-600 dark:text-green-400",
        confirmLabel: "Restore",
        confirmStyle: "bg-orange-500 hover:bg-orange-600 active:bg-orange-700",
    },
    discard: {
        title: "Discard Changes",
        message: "You have unsaved changes. Exiting now will permanently discard them.",
        icon: IoWarningOutline,
        iconBg: "bg-amber-100 dark:bg-amber-900/40",
        iconColor: "text-amber-600 dark:text-amber-400",
        confirmLabel: "Discard",
        confirmStyle: "bg-amber-500 hover:bg-amber-600 active:bg-amber-700",
    },
    bin: {
        title: "Move to Bin",
        message: "This file will be moved to the bin. You can restore it anytime from the Archive.",
        icon: IoArchiveOutline,
        iconBg: "bg-orange-100 dark:bg-orange-900/40",
        iconColor: "text-orange-600 dark:text-orange-400",
        confirmLabel: "Move to Bin",
        confirmStyle: "bg-orange-500 hover:bg-orange-600 active:bg-orange-700",
    },
    delete: {
        title: "Permanently Delete",
        message: "This file will be deleted forever. There is no way to recover it after this action.",
        icon: IoTrashOutline,
        iconBg: "bg-red-100 dark:bg-red-900/40",
        iconColor: "text-red-600 dark:text-red-400",
        confirmLabel: "Delete",
        confirmStyle: "bg-red-500 hover:bg-red-600 active:bg-red-700",
    },
    "delete-all": {
        title: "Delete All Files",
        message: "Every file in the bin will be permanently deleted. This action cannot be undone.",
        icon: IoTrashOutline,
        iconBg: "bg-red-100 dark:bg-red-900/40",
        iconColor: "text-red-600 dark:text-red-400",
        confirmLabel: "Delete All",
        confirmStyle: "bg-red-500 hover:bg-red-600 active:bg-red-700",
    },
    "delete-selected": {
        title: "Delete Selected Files",
        message: "The selected files will be permanently deleted and cannot be recovered.",
        icon: IoTrashOutline,
        iconBg: "bg-red-100 dark:bg-red-900/40",
        iconColor: "text-red-600 dark:text-red-400",
        confirmLabel: "Delete",
        confirmStyle: "bg-red-500 hover:bg-red-600 active:bg-red-700",
    },
    logout: {
        title: "Sign Out",
        message: "You will be signed out of your account. Any unsaved changes may be lost.",
        icon: IoLogOutOutline,
        iconBg: "bg-red-100 dark:bg-red-900/40",
        iconColor: "text-red-600 dark:text-red-400",
        confirmLabel: "Sign Out",
        confirmStyle: "bg-red-500 hover:bg-red-600 active:bg-red-700",
    },
};

const FALLBACK = {
    title: "Confirm Action",
    message: "Are you sure you want to proceed with this action?",
    icon: IoWarningOutline,
    iconBg: "bg-gray-100 dark:bg-neutral-700",
    iconColor: "text-gray-500 dark:text-gray-400",
    confirmLabel: "Confirm",
    confirmStyle: "bg-orange-500 hover:bg-orange-600 active:bg-orange-700",
};

const ConfirmationModal = ({ action, onConfirm, onCancel }) => {
    const config = ACTION_CONFIG[action] ?? FALLBACK;
    const Icon = config.icon;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && onCancel()}
        >
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-neutral-700 overflow-hidden">

                {/* ── Header ── */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-neutral-800">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${config.iconBg}`}>
                            <Icon size={18} className={config.iconColor} />
                        </div>
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                            {config.title}
                        </h2>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                    >
                        <IoClose size={16} />
                    </button>
                </div>

                {/* ── Body ── */}
                <div className="px-5 py-5">
                    <p className="text-sm text-gray-600 dark:text-neutral-400 leading-relaxed">
                        {config.message}
                    </p>
                </div>

                {/* ── Footer ── */}
                <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-neutral-800 bg-gray-50/70 dark:bg-neutral-900/60">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-5 py-2 text-sm rounded-lg font-medium text-white transition ${config.confirmStyle}`}
                    >
                        {config.confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
