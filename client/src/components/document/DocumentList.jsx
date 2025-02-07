import React from 'react'
import { getFileIcon, getFileSizeInMB } from '../../utils/helper'
import { IoIosDocument } from 'react-icons/io'

const DocumentList = ({ documents, listType, loading }) => {
    return (
        <div className="flex-1 overflow-y-auto mt-3 no-scrollbar" >
            {
                listType === "row" ?
                    <ul className="space-y-2">
                        {
                            loading ?
                                Array.from({ length: 10 }).map((_, index) => (
                                    <li key={index}
                                        className="border border-neutral-300 h-16 dark:border-neutral-700 bg-neutral-100 dark:bg-black animate-pulse">
                                    </li>
                                ))
                                :
                                documents?.map((item) => (
                                    <li
                                        key={item?._id}
                                        className="flex justify-between items-center border border-neutral-300 hover:border-orange-400 dark:hover:border-orange-600 dark:border-neutral-700 bg-neutral-100 dark:bg-black px-4 py-2 shadow-md transition duration-500 ease-in-out"
                                    >
                                        <div className="flex items-center">
                                            <IoIosDocument size={35} className='text-gray-500' />
                                            <div className="flex-row pl-2">
                                                <p className="text-gray-900 dark:text-gray-100 -mb-1">{item?.file_name}</p>
                                                <span className="text-neutral-500 text-xs ">{getFileSizeInMB(item?.size)}</span>
                                            </div>

                                        </div>
                                        <button className="text-red-500 hover:text-red-700 transition duration-300">
                                            Remove
                                        </button>
                                    </li>
                                ))}
                    </ul>

                    : <ul className="grid grid-cols-3 gap-2">
                        {
                            loading ?
                                Array.from({ length: 10 }).map((_, index) => (
                                    <li key={index}
                                        className="border border-neutral-300 h-16 dark:border-neutral-700 bg-neutral-100 dark:bg-black animate-pulse">
                                    </li>
                                ))
                                :
                                documents?.map((item) => (
                                    <li
                                        key={item?._id}
                                        className="text-center border border-neutral-300 hover:border-orange-400 dark:hover:border-orange-600 dark:border-neutral-700 bg-neutral-100 dark:bg-black px-4 py-2 shadow-md transition duration-500 ease-in-out"
                                    >
                                        <IoIosDocument size={60} className='text-gray-500 mx-auto -mb-2' />
                                        {/* <img src={getFileIcon(item?.mime_type)} alt="LOGO" className="w-8 h-8 object-cover object-center" /> */}
                                        <span className="text-neutral-500 text-xs ">{getFileSizeInMB(item?.size)}</span>
                                        <p className="text-gray-900 dark:text-gray-100 -mb-1">{item?.file_name}</p>

                                    </li>
                                ))}
                    </ul>
            }



        </div >
    )
}

export default DocumentList