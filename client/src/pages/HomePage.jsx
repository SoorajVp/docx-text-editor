import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CiSearch } from 'react-icons/ci'
import { MdViewList, MdOutlineSort } from 'react-icons/md'
import { PiGridNineFill } from 'react-icons/pi'
import { CgChevronDown } from 'react-icons/cg'
import { IoCloudUploadOutline } from 'react-icons/io5'
import { HiOutlineDocumentAdd } from 'react-icons/hi'
import documentService from '../api/services/document'
import DocumentList from '../components/document/DocumentList'

const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
}

const HomePage = () => {
    const { user_data } = useSelector((store) => store.user)
    const [documentList, setDocumentList] = useState([])
    const [listType, setListType]         = useState('row')
    const [loading, setLoading]           = useState(true)
    const [search, setSearch]             = useState('')
    const [sort, setSort]                 = useState('desc')
    const [debouncedTerm, setDebouncedTerm] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef(null)
    const navigate = useNavigate()

    /* debounce search */
    useEffect(() => {
        const t = setTimeout(() => setDebouncedTerm(search), 500)
        return () => clearTimeout(t)
    }, [search])

    useEffect(() => { fetchDocuments() }, [debouncedTerm, sort])

    /* close dropdown on outside click */
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target))
                setShowDropdown(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const fetchDocuments = async () => {
        setLoading(true)
        try {
            const { documents } = await documentService.GetUserDocuments(search, sort)
            setDocumentList(documents)
        } finally {
            setLoading(false)
        }
    }

    const firstName = user_data?.given_name || user_data?.name?.split(' ')[0] || 'there'

    return (
        <div className="max-w-5xl mx-auto h-[91vh] px-4 pt-4 flex flex-col gap-4">

            {/* ── Greeting ── */}
            <div className="flex items-center justify-between flex-shrink-0">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {getGreeting()}, {firstName}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {loading
                            ? 'Loading your documents…'
                            : documentList.length === 0
                            ? 'No documents yet — create or upload one to get started.'
                            : `You have ${documentList.length} document${documentList.length !== 1 ? 's' : ''}.`}
                    </p>
                </div>

                {/* New Document */}
                <div className="relative flex-shrink-0" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown((p) => !p)}
                        className="flex items-center gap-1.5 text-sm px-4 py-2 rounded font-medium border transition-all duration-200
                            border-orange-400 text-orange-600 bg-orange-50 hover:bg-orange-500 hover:text-white hover:border-orange-500
                            dark:border-orange-600 dark:text-orange-400 dark:bg-orange-950/30 dark:hover:bg-orange-500 dark:hover:text-white dark:hover:border-orange-500"
                    >
                        New Document <CgChevronDown size={18} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showDropdown && (
                        <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-neutral-900 rounded shadow-xl border border-gray-200 dark:border-neutral-700 z-20 overflow-hidden">
                            <button
                                onClick={() => { navigate('/upload'); setShowDropdown(false) }}
                                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-neutral-800 transition"
                            >
                                <IoCloudUploadOutline size={16} className="text-orange-500" />
                                Upload a Document
                            </button>
                            <button
                                onClick={() => { navigate('/create'); setShowDropdown(false) }}
                                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-neutral-800 transition"
                            >
                                <HiOutlineDocumentAdd size={16} className="text-orange-500" />
                                Create a Document
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Toolbar ── */}
            <div className="flex items-center justify-between gap-3 flex-shrink-0">
                {/* Search */}
                <div className="relative w-64">
                    <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search documents…"
                        className="w-full pl-9 pr-3 py-1.5 text-sm rounded
                            bg-white dark:bg-neutral-900
                            text-gray-900 dark:text-neutral-200
                            border border-gray-300 dark:border-neutral-700
                            focus:border-orange-500 dark:focus:border-orange-400
                            focus:ring-1 focus:ring-orange-500/20
                            outline-none transition duration-200"
                    />
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-2">
                    {/* Sort */}
                    <button
                        onClick={() => setSort(sort === 'desc' ? 'asc' : 'desc')}
                        className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition"
                        title={sort === 'desc' ? 'Newest first' : 'Oldest first'}
                    >
                        <MdOutlineSort size={18} />
                        <span className="hidden sm:inline">{sort === 'desc' ? 'Newest' : 'Oldest'}</span>
                    </button>

                    {/* Divider */}
                    <span className="w-px h-4 bg-gray-300 dark:bg-neutral-700" />

                    {/* View toggle */}
                    {listType === 'row' ? (
                        <PiGridNineFill
                            size={20}
                            onClick={() => setListType('col')}
                            title="Grid view"
                            className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition"
                        />
                    ) : (
                        <MdViewList
                            size={20}
                            onClick={() => setListType('row')}
                            title="List view"
                            className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition"
                        />
                    )}
                </div>
            </div>

            {/* ── Section header ── */}
            <div className="flex items-center gap-3 flex-shrink-0 -mb-2">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    My Documents
                </p>
                <div className="flex-1 h-px bg-gray-200 dark:bg-neutral-800" />
            </div>

            {/* ── Document list ── */}
            <DocumentList
                documents={documentList}
                loading={loading}
                listType={listType}
            />
        </div>
    )
}

export default HomePage
