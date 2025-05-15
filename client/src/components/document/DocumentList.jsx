import React from 'react'
import { formatDate, getFileSizeInMB } from '../../utils/helper'
import { IoIosDocument, IoMdMore } from 'react-icons/io'
import { Link } from 'react-router-dom'

const DocumentList = ({ documents, listType, loading }) => {
    return (
        <div className="flex-1 overflow-y-auto mt-3 no-scrollbar" >
            {
                listType === "row" ?
                    <ul className="space-y-2">
                        {
                            loading ?
                                Array.from({ length: 5 }).map((_, index) => (
                                    <li key={index}
                                        className="border border-neutral-300 h-16 dark:border-neutral-700 bg-neutral-100 dark:bg-black animate-pulse">
                                    </li>
                                ))
                                :
                                documents?.map((item) => (
                                    <Link to={`/doc/view/${item?._id}`}
                                        key={item?._id}
                                        className="flex justify-between items-center border border-neutral-300 hover:border-orange-400 dark:hover:border-orange-600 dark:border-neutral-700 bg-neutral-100 dark:bg-black px-4 py-2 shadow-md transition duration-500 ease-in-out"
                                    >
                                        <div className="flex items-center">
                                            <IoIosDocument size={35} className='text-gray-500' />
                                            <div className="flex-row pl-2">
                                                <p className="text-gray-900 dark:text-gray-100 -mb-1 text-sm md:text-base truncate overflow-hidden whitespace-nowrap w-64 ">{item?.file_name}</p>
                                                <span className="text-neutral-500 text-xs ">{getFileSizeInMB(item?.size) + " - " + formatDate(item?.createdAt)} </span>
                                            </div>

                                        </div>
                                        <div className='flex items-center'>
                                            <div className="flex-row text-right">
                                                <p className="text-neutral-500 text-xs ">Last Modified <br /> {formatDate(item?.updatedAt)}</p>
                                            </div>
                                            {/* <button className="text-neutral-900 dark:text-neutral-100  hover:text-neutral-600 dark:hover:text-neutral-400 transition duration-300">
                                                <IoMdMore size={30} />
                                            </button> */}
                                        </div>
                                    </Link>
                                ))}
                    </ul>

                    : <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {
                            loading ?
                                Array.from({ length: 10 }).map((_, index) => (
                                    <li key={index}
                                        className="border border-neutral-300 h-40 dark:border-neutral-700 bg-neutral-100 dark:bg-black animate-pulse">
                                    </li>
                                ))
                                :
                                documents?.map((item) => (
                                    <Link to={`/doc/view/${item?._id}`}
                                        key={item?._id}
                                        className="text-center border border-neutral-300 hover:border-orange-400 dark:hover:border-orange-600 dark:border-neutral-700 bg-neutral-100 dark:bg-black p-5 shadow-md transition duration-500 ease-in-out"
                                    >
                                        <IoIosDocument size={60} className='text-gray-500 mx-auto -mb-3' />
                                        <span className="text-neutral-500 text-xs ">{getFileSizeInMB(item?.size)}</span>
                                        <p className="text-gray-900 dark:text-gray-100 -mb-1 text-sm md:text-base truncate overflow-hidden whitespace-nowrap ">{item?.file_name}</p>
                                        <p className="text-neutral-500 text-xs mt-1">{formatDate(item?.createdAt)}</p>
                                        <p className="text-neutral-500 text-xs mt-1">Modified - {formatDate(item?.updatedAt)}</p>
                                    </Link>
                                ))}
                    </ul>
            }

        </div >
    )
}

export default DocumentList