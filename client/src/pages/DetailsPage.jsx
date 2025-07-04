import React, { useEffect, useState } from 'react'
import documentService from '../api/services/document'
import { useNavigate, useParams } from 'react-router-dom'
import DocumentViewer from '../components/document/DocViewer'
import { GetFileExtension } from '../utils/helper'
import DetailSidebar from '../components/layout/Sidebar'
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast'
import { setDocumentData } from '../redux/slice/documentSlice'
import { useDispatch } from 'react-redux'

const DetailsPage = () => {
  const { id } = useParams()
  const [document, setDocument] = useState(null)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDocumentById = async () => {
      const { document } = await documentService.GetDocumentById(id)
      setDocument(document)
      dispatch(setDocumentData(document));
    }
    fetchDocumentById()
  }, [])


  const HandleMoveToBin = async (id) => {
    await documentService.DocumentSoftDelete(id)
    navigate('/')
  }

  const HandleSaveFileName = async (fileName, document) => {
    // Your custom logic to save the file name
    console.log("Saving:", fileName);
    const payload = {
      id: document?._id,
      mimetype: document?.mime_type,
      fileName: fileName
    }
    const response = await documentService.UpdateFileName(payload);
    setDocument(response?.document);
    dispatch(setDocumentData(response?.document));

  };

  return (
    <div className='flex h-full'>
      {/* <DocSidebar document={document} /> */}
      <DetailSidebar onDelete={HandleMoveToBin} onSaveFileName={HandleSaveFileName} />
      <div className='w-full h-full flex justify-center ml-16'>
        <DocumentViewer url={document?.url} mime_type={GetFileExtension(document?.mime_type)} />
      </div>
    </div>
  )
}

export default DetailsPage