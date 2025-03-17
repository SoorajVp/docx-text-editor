import React from 'react';
import { DownloadDocument, formatDate, GetFileExtension, getFileSizeInMB } from '../utils/helper';
import { FaFile, FaCalendarAlt, FaSave, FaEdit } from 'react-icons/fa'; // Import icons from react-icons

const DocSidebar = ({ document }) => {


  return (
    <div className='hidden lg:block w-1/4 h-full bg-neutral-300 dark:bg-black overflow-auto p-6 border-t border-neutral-500'>
      <div className='space-y-6 text-neutral-800 dark:text-white'>
        <div className='flex items-center space-x-3'>
          <h1 className='text-2xl font-semibold'>{document?.file_name}</h1>
        </div>

        <div className='space-y-4'>
          <div className='flex items-center space-x-3'>
            <FaFile className='text-xl' />
            <p className='text-lg'>Type: {GetFileExtension(document?.mime_type)}</p>
          </div>

          <div className='flex items-center space-x-3'>
            <FaSave className='text-xl' />
            <p className='text-lg'>Size: {getFileSizeInMB(document?.size)} MB</p>
          </div>

          <div className='flex items-center space-x-3'>
            <FaCalendarAlt className='text-xl' />
            <p className='text-lg'>Uploaded on: {formatDate(document?.createdAt)}</p>
          </div>

          <div className='flex items-center space-x-3'>
            <FaEdit className='text-xl' />
            <p className='text-lg'>Last updated: {formatDate(document?.updatedAt)}</p>
          </div>

          <button onClick={() => DownloadDocument(document?.url, document?.file_name)} className="w-full text-lg font-semibold mt-3 py-1.5 border-2 border-orange-500 text-orange-500 hover:bg-orange-600 hover:text-white transition duration-300" >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocSidebar;