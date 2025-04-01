import React from 'react';

const ConfirmationModal = ({ action, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-sm shadow-2xl max-w-sm w-full">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                    {action === 'restore' && 'Restore File'}
                    {action === 'bin' && 'Move File to Bin'}
                    {action === 'delete' && 'Permanently Delete File'}
                    {action === 'delete-all' && 'Delete All Files'}
                    {action === 'restore-all' && 'Restore All Files'}
                    {action === 'restore-selected' && 'Restore Selected Files'}
                    {action === 'delete-selected' && 'Delete Selected Files'}
                    {action === 'logout' && 'Logout Account'}

                </h2>
                <p className="text-neutral-700 dark:text-neutral-300 mb-6">
                    {action === 'restore' && 'Restore this file? It will go back to your documents.'}
                    {action === 'bin' && 'Move this file to the bin? You can restore it later.'}
                    {action === 'delete' && 'Permanently delete this file? This cannot be undone.'}
                    {action === 'delete-all' && 'Are you sure you want to delete all files in the bin? This action cannot be undone.'}
                    {action === 'restore-all' && 'Are you sure you want to restore all files from the bin?'}
                    {action === 'restore-selected' && 'Are you sure you want to restore the selected files?'}
                    {action === 'delete-selected' && 'Are you sure you want to permanently delete the selected files? This cannot be undone.'}
                    {action === 'logout' && 'Are you sure you want to log out? You may lose unsaved changes.'}

                </p>
                <div className="flex justify-end space-x-3">
                    <button className="px-4 py-1.5 bg-gray-300 dark:bg-neutral-600 text-gray-800 dark:text-white" onClick={onCancel}>Cancel</button>
                    <button className={`${action === "delete" || action === "delete-all" || action === "delete-selected" || action === "logout" ? 'bg-red-600' : 'bg-orange-600'} px-4 py-1.5 text-white`} onClick={onConfirm}>
                        {action === 'delete' ? 'Delete' :
                            action === 'restore' ? 'Restore' :
                                action === 'bin' ? 'Move to Bin' :
                                    action === 'delete-all' ? 'Delete All' :
                                        action === 'restore-all' ? 'Restore All' :
                                            action === 'restore-selected' ? 'Restore Selected' :
                                                action === 'delete-selected' ? 'Delete Selected' :
                                                    action === 'logout' ? 'Confirm' :
                                                        'Move'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
