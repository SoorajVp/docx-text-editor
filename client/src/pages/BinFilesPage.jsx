import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import documentService from '../api/services/document';
import BinFIlesList from '../components/BinFilesList';
import ConfirmationModal from '../components/modals/AlertModal';

const BinFilesPage = () => {
    const [documentList, setDocumentList] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isCheckBox, setIsCheckBox] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [modalAction, setModalAction] = useState(null); // Action to perform in modal
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            const { documents } = await documentService.GetBinDocuments();
            setDocumentList(documents);
            setLoading(false);
        };
        fetchDocuments();
    }, [search]);

    const handleCheckboxChange = (fileId) => {
        setSelectedFiles((prevSelected) =>
            prevSelected.includes(fileId)
                ? prevSelected.filter((id) => id !== fileId)
                : [...prevSelected, fileId]
        );
    };

    function groupDocumentIds() {
        return documentList.map(doc => doc._id);
    }

    const handleRestoreFile = async (documentIds) => {
        setLoading(true);
        await documentService.RestoreBinFiles({ ids: documentIds });
        setDocumentList(prevList => prevList.filter(doc => !documentIds.includes(doc._id)));
        setSelectedFiles([]);
        setIsCheckBox(false);
        setLoading(false);
    };

    const handleRestoreAllFiles = async () => {
        setLoading(true);
        const mappedIds = groupDocumentIds();
        await documentService.RestoreBinFiles({ ids: mappedIds });
        setDocumentList(prevList => prevList.filter(doc => !mappedIds.includes(doc._id)));
        setSelectedFiles([]);
        setIsCheckBox(false);
        setLoading(false);
    };

    const handleDeleteFile = async (documentIds) => {
        setLoading(true);
        await documentService.DeleteBinFiles({ ids: documentIds });
        setDocumentList(prevList => prevList.filter(doc => !documentIds.includes(doc._id)));
        setSelectedFiles([]);
        setIsCheckBox(false);
        setLoading(false);
    };

    const handleDeleteAllFiles = async () => {
        setLoading(true);
        const mappedIds = groupDocumentIds();
        await documentService.DeleteBinFiles({ ids: mappedIds });
        setDocumentList([]);
        setSelectedFiles([]);
        setIsCheckBox(false);
        setLoading(false);
    };

    const openModal = (action) => {
        setModalAction(action);  // Set action to be confirmed in modal
        setShowModal(true); // Show the modal
    };

    const handleConfirmAction = async () => {
        if (modalAction === "restore") {
            handleRestoreFile(selectedFiles);
        } else if (modalAction === "bin") {
            // Handle moving to bin
        } else if (modalAction === "delete") {
            handleDeleteFile(selectedFiles);
        } else if (modalAction === "delete-all") {
            handleDeleteAllFiles();
        } else if (modalAction === "restore-all") {
            handleRestoreAllFiles();
        } else if (modalAction === "restore-selected") {
            handleRestoreFile(selectedFiles);
        } else if (modalAction === "delete-selected") {
            handleDeleteFile(selectedFiles);
        }
        setShowModal(false); // Close modal after action
    };

    return (
        <div className="max-w-5xl mx-auto h-[90vh] p-2 flex flex-col">
            <div className="z-10">
                <div className="flex justify-between items-center">
                    <h2 className='text-neutral-700 dark:text-neutral-300 text-xl'>Bin Shared files</h2>
                    <div className={`${documentList?.length === 0 ? 'hidden' : "flex"} gap-1 items-center text-gray-500 `}>
                        {
                            isCheckBox ?
                                <>
                                    <button onClick={() => { setIsCheckBox(false); setSelectedFiles([]) }} className="px-5 py-1 border-2 text-sm font-semibold border-neutral-500 dark:border-neutral-400 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-600 hover:text-white transition duration-300 ease-in-out">
                                        Cancel
                                    </button>
                                    {
                                        selectedFiles?.length > 0 &&
                                        <>
                                            <button onClick={() => openModal("restore-selected")} className="px-5 py-1 border-2 text-sm font-medium border-orange-500 text-orange-500 hover:bg-orange-600 hover:text-white transition duration-300 ease-in-out">
                                                Restore Selected
                                            </button>
                                            <button onClick={() => openModal("delete-selected")} className="px-5 py-1 border-2 text-sm font-medium border-red-500 text-red-500 hover:bg-red-600 hover:text-white transition duration-300 ease-in-out">
                                                Delete Selected
                                            </button>
                                        </>
                                    }
                                </>
                                :
                                <>
                                    <button onClick={() => setIsCheckBox(true)} className="px-5 py-1 border-2 text-sm font-semibold border-neutral-500 dark:border-neutral-400 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-600 hover:text-white transition duration-300 ease-in-out">
                                        Select
                                    </button>
                                    <button onClick={() => openModal("restore-all")} className="px-5 py-1 border-2 text-sm font-medium border-orange-500 text-orange-500 hover:bg-orange-600 hover:text-white transition duration-300 ease-in-out">
                                        Restore All
                                    </button>
                                    <button onClick={() => openModal("delete-all")} className="px-5 py-1 border-2 text-sm font-medium border-red-500 text-red-500 hover:bg-red-600 hover:text-white transition duration-300 ease-in-out">
                                        Delete All
                                    </button>
                                </>
                        }
                    </div>
                </div>
            </div>
            {isCheckBox ?
                <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-1"> {selectedFiles?.length} documents selected </p> :
                <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-1">{loading ? `Loading documents...` : `Showing ${documentList?.length} deleted documents`}  </p>
            }
            <BinFIlesList documents={documentList} loading={loading} restorFile={handleRestoreFile} selectedFiles={selectedFiles} handleCheckboxChange={handleCheckboxChange} isCheckBox={isCheckBox} />

            {/* Show confirmation modal if action is pending */}
            {showModal &&
                <ConfirmationModal 
                    action={modalAction}
                    onConfirm={handleConfirmAction}
                    onCancel={() => setShowModal(false)}
                />
            }
        </div>
    );
};

export default BinFilesPage;
