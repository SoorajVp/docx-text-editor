import React, { useEffect, useState, useRef } from 'react'
import documentService from '../api/services/document'
import DocumentList from '../components/document/DocumentList'
import { MdViewList } from 'react-icons/md'
import { PiGridNineFill } from "react-icons/pi"
import { CiSearch } from "react-icons/ci"
import { useNavigate } from 'react-router-dom'
import { CgChevronDown } from "react-icons/cg";

const HomePage = () => {
  const [documentList, setDocumentList] = useState([])
  const [listType, setListType] = useState("row")
  const [loading, setLoading] = useState(true)
  const [Search, setSearch] = useState("")
  const [debouncedTerm, setDebouncedTerm] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()
  
  // Reference for dropdown
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(Search)
    }, 500)

    return () => clearTimeout(handler)
  }, [Search])

  useEffect(() => {
    fetchDocuments()
  }, [debouncedTerm])

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const { documents } = await documentService.GetUserDocuments(Search)
      setDocumentList(documents)
    } finally {
      setLoading(false)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])


  return (
    <div className="max-w-5xl mx-auto h-[91vh] p-2 flex flex-col">
      <div className="z-10">
        <div className="flex justify-between items-center">
          {/* Search Input */}
          <div className="relative w-64">
            <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              value={Search}
              className="w-full pl-10 pr-3 py-1 text-sm  bg-white dark:bg-black text-black dark:text-neutral-200 border border-gray-400 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-300 outline-none transition duration-300"
            />
          </div>

          <div className="flex gap-1 items-center text-gray-500">
            {/* Toggle View */}
            {listType === "row" ? (
              <PiGridNineFill size={25} onClick={() => setListType("col")} className="cursor-pointer text-gray-700 dark:text-gray-300 " />
            ) : (
              <MdViewList size={25} onClick={() => setListType("row")} className="cursor-pointer text-gray-700 dark:text-gray-300" />
            )}

            {/* New Document Button with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="flex gap-1 items-center px-4 py-1 border-2 text-xs md:text-sm font-medium border-orange-500 text-orange-500 hover:bg-orange-600 hover:text-white transition duration-300 ease-in-out"
              >
                New Document<CgChevronDown size={20} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-black shadow-md border border-gray-300 dark:border-gray-700">
                  <button
                    onClick={() => {
                      navigate("/upload")
                      setShowDropdown(false) // Close dropdown
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-orange-100 dark:hover:bg-orange-600"
                  >
                    Upload a Document
                  </button>
                  <button
                    onClick={() => {
                      navigate("/create")
                      setShowDropdown(false) // Close dropdown
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-orange-100 dark:hover:bg-orange-600"
                  >
                    Create a Document
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="text-neutral-700 dark:text-neutral-300 text-sm p-1">
        {loading ? `Loading documents...` : `Showing ${documentList?.length} documents`}
      </p>

      <DocumentList documents={documentList} loading={loading} listType={listType} />
    </div>
  )
}

export default HomePage
