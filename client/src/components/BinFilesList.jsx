import React, { useState } from 'react';
import { IoIosDocument } from 'react-icons/io';
import { getFileSizeInMB } from '../utils/helper';
import { TiTick } from "react-icons/ti";
import { BsTrash3Fill } from "react-icons/bs";
import { MdOutlineRestore } from 'react-icons/md';
import ConfirmationModal from './modals/AlertModal';

const BinFilesList = ({ documents, loading, restorFile, deleteFile, isCheckBox, handleCheckboxChange, selectedFiles }) => {
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [selectedFileId, setSelectedFileId] = useState(null);

    const handleConfirmAction = () => {
        if (modalAction === 'restore') {
            restorFile(selectedFileId);
        } else if (modalAction === 'delete') {
            deleteFile(selectedFileId);
        }
        setShowModal(false);
    };

    const openModal = (action, fileId) => {
        setModalAction(action);
        setSelectedFileId(fileId);
        setShowModal(true);
    };

    return (
        <div className="flex-1 overflow-y-auto mt-3 no-scrollbar">
            <ul className="space-y-2">
                {loading
                    ? Array.from({ length: 5 }).map((_, index) => (
                        <li key={index} className="border border-neutral-300 h-16 dark:border-neutral-700 bg-neutral-100 dark:bg-black animate-pulse"></li>
                    ))
                    : documents?.map((item) => (
                        <li key={item?._id} className="flex justify-between items-center border border-neutral-300 hover:border-orange-400 dark:hover:border-orange-600 dark:border-neutral-700 bg-neutral-100 dark:bg-black px-4 py-2 shadow-md transition duration-500 ease-in-out">
                            <div className="flex items-center">
                                <IoIosDocument size={35} className="text-gray-500" />
                                <div className="flex-row pl-2">
                                    <p className="text-gray-900 dark:text-gray-100 -mb-1">{item?.file_name}</p>
                                    <span className="text-neutral-500 text-xs">{getFileSizeInMB(item?.size)}</span>
                                </div>
                            </div>

                            {isCheckBox ? (
                                <div className="form-control">
                                    <label className="label cursor-pointer flex items-center space-x-2">
                                        <input type="checkbox" checked={selectedFiles.includes(item?._id)} onChange={() => handleCheckboxChange(item?._id)} className="peer hidden" />
                                        <div className="w-5 h-5 border border-neutral-500 flex items-center justify-center peer-checked:bg-orange-500 peer-checked:border-orange-600">
                                            {selectedFiles.includes(item?._id) && <TiTick size={20} className='text-white ' />}
                                        </div>
                                    </label>
                                </div>
                            ) : (
                                <div className='flex gap-3'>
                                    <button className="text-blue-400 hover:text-blue-500 transition duration-300" onClick={() => openModal('restore', item?._id)}>
                                        <MdOutlineRestore size={20} />
                                    </button>
                                    <button className="text-red-500 hover:text-red-600 transition duration-300" onClick={() => openModal('delete', item?._id)}>
                                        <BsTrash3Fill size={16} />
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
            </ul>

            {(documents.length === 0 && !loading) && (
                <h3 className="flex items-center justify-center h-full text-xl text-gray-500">No Deleted History</h3>
            )}

            {/* Modal Component */}
            {showModal && (
                <ConfirmationModal
                    action={modalAction}
                    onConfirm={handleConfirmAction}
                    onCancel={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default BinFilesList;
