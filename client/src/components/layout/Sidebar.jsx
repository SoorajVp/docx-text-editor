import React, { useEffect, useRef, useState } from 'react';
import { FaFile, FaSave, FaCalendarAlt } from 'react-icons/fa';
import { TbLayoutSidebarLeftCollapseFilled, TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { IoMdDownload, IoMdTrash } from "react-icons/io";
import { MdMovieEdit, MdOutlineFileDownloadDone, MdUpdate } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { RiEdit2Fill } from "react-icons/ri";
import { formatDate, GetFileExtension, getFileNameOG, getFileSizeInMB } from '../../utils/helper';
import ConfirmationModal from '../modals/AlertModal';
import documentService from '../../api/services/document';

const DetailSidebar = ({ document, onDownload, onDelete, onUpdate, onSaveFileName }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef(null);
    const [fileName, setFileName] = useState("");

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    useEffect(() => {
        if (isEditing) {
            setFileName(getFileNameOG(document?.file_name))
        }
    }, [isEditing]);


    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleDeleteClick = () => {
        setShowModal(true);
    };

    const handleConfirmDelete = () => {
        onDelete(document?._id);
        setShowModal(false);
    };

    const handleSaveFileName = async() => {
        // Your custom logic to save the file name
        console.log("Saving:", fileName);
        await onSaveFileName(fileName)
        setIsEditing(false);
    };

    const handleCloseInput = () => {
        setIsEditing(false);
    }

    const handleEditClick = (e) => {
        e.stopPropagation();
        setIsSidebarOpen(true);
        setIsEditing(true);
    };

    const handleSaveClick = (e) => {
        console.log("Saving------------------")
        e.stopPropagation();
        handleSaveFileName();
    };


    return (
        <>
            {isSidebarOpen && (
                <div className="fixed inset-0 opacity-50 z-10 lg:hidden bg-black dark:bg-white " onClick={toggleSidebar}></div>
            )}

            <div
                className={`fixed lg:relative z-30 h-full transition-all duration-300 ease-in-out overflow-auto
                bg-neutral-300 dark:bg-black border-t-2 dark:border-neutral-800 
                ${isSidebarOpen ? 'w-64 lg:w-1/4' : 'w-16 overflow-hidden'}`}
            >
                {/* Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className={`h-14 w-full rounded-md transition-colors 
                    text-gray-800 dark:text-gray-200
                    flex items-center ${isSidebarOpen ? "justify-between p-3" : "justify-center"}`}
                >   {isSidebarOpen && <span className='ml-4 uppercase font-semibold text-sm overflow-hidden truncate whitespace-nowrap w-52 text-start'>{getFileNameOG(document?.file_name)}</span>}
                    <span className="rounded-md transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400">
                        {isSidebarOpen ? <TbLayoutSidebarLeftCollapseFilled size={30} /> : <TbLayoutSidebarLeftExpand size={30} />}
                    </span>
                </button>

                {/* Sidebar Items */}
                <div className={isSidebarOpen ? 'mx-5' : 'flex justify-center'}>
                    <ul className="space-y-3">

                        <div
                            onClick={() => {
                                setIsSidebarOpen(true);
                                setIsEditing(true);
                            }}
                            className={`flex items-center gap-3 p-2 text-gray-800 dark:text-gray-300 
    hover:bg-gray-100 dark:hover:bg-neutral-800 
    rounded-sm w-full transition-all duration-200 
    ${isEditing ? "border border-orange-500" : "border border-transparent"}`}
                        >
                            <button>
                                {isEditing ? (
                                    <MdOutlineFileDownloadDone onMouseDown={handleSaveClick} size={21} />
                                ) : (
                                        <RiEdit2Fill onClick={handleEditClick} size={21} />
                                )}
                            </button>

                            {isSidebarOpen &&
                                (isEditing ? (
                                    <input
                                        type="text"
                                        ref={inputRef}
                                        value={fileName}
                                        onChange={(e) => setFileName(e.target.value)}
                                        onBlur={handleCloseInput}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleSaveFileName();
                                            }
                                        }}
                                        className="bg-transparent border-none focus:outline-none w-full text-sm"
                                    />
                                ) : (
                                    <span className="text-sm overflow-hidden text-nowrap">
                                        {document?.file_name}
                                    </span>
                                ))}
                        </div>


                        {/* <SidebarItem icon={<FaFile size={20} />} text={document?.file_name} isSidebarOpen={isSidebarOpen} /> */}
                        <SidebarItem icon={<FaSave size={20} />} text={getFileSizeInMB(document?.size)} isSidebarOpen={isSidebarOpen} />
                        <SidebarItem icon={<FaCalendarAlt size={20} />} text={formatDate(document?.createdAt)} isSidebarOpen={isSidebarOpen} />
                        <SidebarItem icon={<MdMovieEdit size={20} />} text={formatDate(document?.updatedAt)} isSidebarOpen={isSidebarOpen} />
                        {/* <SidebarItem icon={<IoMdDownload size={20} />} text="Download" isSidebarOpen={isSidebarOpen} isActive /> */}
                        <button className="flex items-center gap-3 p-2 text-gray-800 dark:text-gray-300 bg-gray-200 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-sm w-full" onClick={() => onDownload(document?.url, document?.file_name)}>
                            <IoMdDownload size={20} /> {isSidebarOpen && "Download"}
                        </button>
                        <button className="flex items-center gap-3 p-2 text-gray-800 dark:text-gray-300 bg-gray-200 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-sm w-full" onClick={onUpdate}>
                            <MdUpdate size={20} /> {isSidebarOpen && "Update Document"}
                        </button>
                        <button className="flex items-center gap-3 p-2 text-red-600 dark:text-red-400 bg-gray-200 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-sm w-full" onClick={handleDeleteClick}>
                            <IoMdTrash size={20} /> {isSidebarOpen && "Delete Document"}
                        </button>
                    </ul>
                </div>
            </div>
            {showModal && (
                <ConfirmationModal
                    action="bin"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowModal(false)}
                />
            )}
        </>
    );
};

const SidebarItem = ({ icon, text, isSidebarOpen, isActive }) => {
    return (
        <li>
            <div
                className="flex items-center gap-3 p-2 rounded-sm transition-colors text-gray-800 dark:text-gray-300 truncate whitespace-nowrap" >
                {icon}
                {isSidebarOpen && text}
            </div>
        </li>
    );
};

export default DetailSidebar;
