import React, { useEffect, useState } from 'react'
import documentService from '../api/services/document'
import DocumentList from '../components/document/DocumentList'
import { MdOutlineTableRows } from 'react-icons/md'
import { RiTable2 } from 'react-icons/ri'
import { CiSearch } from "react-icons/ci";
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const [documentList, setDocumentList] = useState([])
  const [listType, setListType] = useState("row")
  const [loading, setLoading] = useState(true)
  const [Search, setSearch] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true)
      const { documents } = await documentService.GetUserDocuments(Search)
      setDocumentList(documents)
      setLoading(false)
    }
    fetchDocuments()
  }, [Search])

  return (
    <div className="max-w-5xl mx-auto h-[90vh] p-2 flex flex-col">
      {/* Header (Non-Fixed but Stays on Top) */}
      <div className="z-10 ">
        {/*   <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Media Library</h2>
            <p className="text-neutral-700 dark:text-neutral-300 text-sm -mt-1">Showing {documentList?.length} documents</p> */}

        <div className="flex justify-between items-center">
          <div className="relative w-64">
            <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text" onChange={(e) => setSearch(e.target.value)}
              placeholder="Search" value={Search}
              className="w-full pl-10 pr-3 py-1 text-base bg-white dark:bg-black text-black dark:text-neutral-200 border border-gray-400 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-300 outline-none transition duration-300"
            />
          </div>

          <div className="flex gap-1 items-center text-gray-500">
            {
              listType === "row" ?
                <RiTable2 size={25} onClick={() => setListType("col")} className="text-gray-700 dark:text-gray-300" />
                : <MdOutlineTableRows size={25} onClick={() => setListType("row")} className="text-gray-700 dark:text-gray-300" />
            }

            <button onClick={() => navigate("/upload")} className="px-4 py-1 border-2 font-medium border-orange-500 text-orange-500 hover:bg-orange-600 hover:text-white transition duration-300 ease-in-out">
              New Document
            </button>
          </div>
        </div>
      </div>
      <p className="text-neutral-700 dark:text-neutral-300 text-sm p-1">{loading ? `Loading documents...` : `Showing ${documentList?.length} documents`}  </p>
      <DocumentList documents={documentList} loading={loading} listType={listType} />
    </div>
  );
}

export default HomePage