import React, { useEffect, useState } from 'react'
import documentService from '../api/services/document'
import { useNavigate, useParams } from 'react-router-dom'
import DocumentViewer from '../components/document/DocViewer'
import { GetFileExtension } from '../utils/helper'
import DetailSidebar from '../components/layout/Sidebar'


const DetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [document, setDocument] = useState(null)

  useEffect(() => {
    const fetchDocumentById = async () => {
      const { document } = await documentService.GetDocumentById(id)
      setDocument(document)
    }
    fetchDocumentById()
  }, [])
  

  function HandleDownload(url, fileName) {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  }

  const HandleMoveToBin = async (id) => {
    await documentService.DocumentSoftDelete(id)
    navigate('/')
  }

  return (
    <div className='flex h-full'>
      {/* <DocSidebar document={document} /> */}
      <DetailSidebar document={document} onDownload={HandleDownload} onDelete={HandleMoveToBin } />
      <div className='w-full h-full flex justify-center ml-16'>
        <DocumentViewer url={document?.url} mime_type={GetFileExtension(document?.mime_type)} />
      </div>
    </div>
  )
}

export default DetailsPage