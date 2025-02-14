import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import documentService from '../api/services/document'
import DocumentList from '../components/document/DocumentList'
import { CiSearch } from 'react-icons/ci'
import { MdOutlineTableRows } from 'react-icons/md'
import { RiTable2 } from 'react-icons/ri'
import BinFIlesList from '../components/BinFilesList'

const BinFilesPage = () => {
    const [documentList, setDocumentList] = useState([])
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isCheckBox, setIsCheckBox] = useState(false)
    const [listType, setListType] = useState("row")
    const [loading, setLoading] = useState(true)
    const [Search, setSearch] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true)
            const { documents } = await documentService.GetBinDocuments()
            setDocumentList(documents)
            setLoading(false)
        }
        fetchDocuments()
    }, [Search])

    // Handler for checkbox change
    const handleCheckboxChange = (fileId) => {
        setSelectedFiles((prevSelected) =>
            prevSelected.includes(fileId)
                ? prevSelected.filter((id) => id !== fileId) // Remove if already selected
                : [...prevSelected, fileId] // Add if not selected
        );
    };


    return (
        <div className="max-w-5xl mx-auto h-[90vh] p-2 flex flex-col">
            <div className="z-10">

                <div className="flex justify-between items-center">
                    <h2 className='text-neutral-700 dark:text-neutral-300 text-xl'>Bin Shared files</h2>

                    <div className={`${selectedFiles?.length === 0 ? "hidden" : "flex" }  gap-1 items-center text-gray-500 `}>
                        {
                            listType === "row" ?
                                <RiTable2 size={25} onClick={() => setListType("col")} className="text-gray-700 dark:text-gray-300" />
                                : <MdOutlineTableRows size={25} onClick={() => setListType("row")} className="text-gray-700 dark:text-gray-300" />
                        }


                        {
                            isCheckBox ?
                                <>
                                    <button onClick={() => setIsCheckBox(false)} className="px-5 py-1 border-2 font-medium border-neutral-500 bg-neutral-500 text-white hover:bg-neutral-600 hover:text-white transition duration-300 ease-in-out">
                                        Cancel
                                    </button>
                                    <button onClick={() => navigate("/upload")} className="px-4 py-1 border-2 font-medium border-red-500 bg-red-500 text-white hover:bg-red-600 hover:text-white transition duration-300 ease-in-out">
                                        Delete
                                    </button>
                                </>
                                :
                                <>
                                    <button onClick={() => setIsCheckBox(true)} className="px-5 py-1 border-2 font-medium border-orange-500 text-orange-500 hover:bg-orange-600 hover:text-white transition duration-300 ease-in-out">
                                        Select
                                    </button>
                                    <button onClick={() => navigate("/upload")} className="px-4 py-1 border-2 font-medium border-red-500 bg-red-500 text-white hover:bg-red-600 hover:text-white transition duration-300 ease-in-out">
                                        Delete All
                                    </button>
                                </>
                        }

                    </div>
                </div>
            </div>
            {
                isCheckBox ?
                    <p className="text-neutral-700 dark:text-neutral-300 text-sm p-1"> {selectedFiles?.length} documents selected </p> :
                    <p className="text-neutral-700 dark:text-neutral-300 text-sm p-1">{loading ? `Loading documents...` : `Showing ${documentList?.length} documents`}  </p>
            }
            <BinFIlesList documents={documentList} loading={loading} listType={listType} selectedFiles={selectedFiles} handleCheckboxChange={handleCheckboxChange} isCheckBox={isCheckBox} />
        </div>
    );
}

export default BinFilesPage