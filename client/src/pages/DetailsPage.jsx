import React, { useEffect, useState } from 'react'
import DocSidebar from '../components/DocSidebar'
import documentService from '../api/services/document'
import { useParams } from 'react-router-dom'
import DocumentViewer from '../components/document/DocViewer'
import { GetFileExtension } from '../utils/helper'


const DetailsPage = () => {
  const { id } = useParams()
  const [document, setDocument] = useState(null)
  useEffect(() => {
    const fetchDocumentById = async () => {
      const { document } = await documentService.GetDocumentById(id)
      setDocument(document)
    }
    fetchDocumentById()
  }, [])

  return (
    <div className='flex h-full'>
      <DocSidebar document={document} />
      <div className='w-full h-full flex justify-center'>
        <DocumentViewer url={document?.url} mime_type={GetFileExtension(document?.mime_type)} />
      </div>
    </div>
  )
}

export default DetailsPage