import React, { useEffect, useState } from 'react'
import documentService from '../api/services/document'
import { useNavigate, useParams } from 'react-router-dom'
import DocumentViewer from '../components/document/DocViewer'
import { GetFileExtension } from '../utils/helper'
import DetailSidebar from '../components/layout/Sidebar'
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast'

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


  const HandleDownload = async (url, fileName) => {
    try {
      toast.loading("File Downloading...", {
        style: {
          border: '1px solid #5ca336',
          borderRadius: '5px',
          padding: '8px',
          color: '#fff',
          backgroundColor: '#1a1a1a',
        }
      });
      const response = await fetch(url);
      const blob = await response.blob();
      saveAs(blob, fileName); // Triggers the download
      toast.dismiss()
      toast("Download Completed", {
        style: {
          border: '1px solid #5ca336',
          borderRadius: '5px',
          padding: '8px',
          color: '#fff',
          backgroundColor: '#1a1a1a',
        },
        icon: "✔️"
      });
    } catch (error) {
      toast.dismiss()
      console.error('Download failed:', error);
      toast.error("Error While Downloading", {
        style: {
          border: '1px solid #ff4040',
          borderRadius: '0px',
          padding: '8px',
          color: '#fff',
          backgroundColor: '#1a1a1a',
        },
        iconTheme: {
          primary: '#ff1e1e',
          secondary: '#FFFAEE',
        },
      });
    }

  }

  const HandleMoveToBin = async (id) => {
    await documentService.DocumentSoftDelete(id)
    navigate('/')
  }

  return (
    <div className='flex h-full'>
      {/* <DocSidebar document={document} /> */}
      <DetailSidebar document={document} onDownload={HandleDownload} onDelete={HandleMoveToBin} />
      <div className='w-full h-full flex justify-center ml-16'>
        <DocumentViewer url={document?.url} mime_type={GetFileExtension(document?.mime_type)} />
      </div>
    </div>
  )
}

export default DetailsPage