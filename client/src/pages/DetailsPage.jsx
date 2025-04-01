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
    if (typeof document !== "undefined") {  // Ensure it's running in the browser
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } else {
      console.error("Download function can only run in a browser.");
    }
  }

  const HandleMoveToBin = async (id) => {
    await documentService.DocumentSoftDelete(id)
    navigate('/')
  }

  return (
    <div className='flex h-full'>
      {/* <DocSidebar document={document} /> */}
      <DetailSidebar document={document} onDownload={HandleDownload} onDelete={HandleMoveToBin } />
      <div className='w-full h-full flex justify-center'>
        <DocumentViewer url={document?.url} mime_type={GetFileExtension(document?.mime_type)} />
      </div>
    </div>
  )
}

export default DetailsPage