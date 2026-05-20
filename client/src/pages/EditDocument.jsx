import React, { useEffect, useState } from 'react'
import documentService from '../api/services/document'
import { useNavigate, useParams } from 'react-router-dom'
import DocumentViewer from '../components/document/DocViewer'
import { GetFileExtension } from '../utils/helper'
import DetailSidebar from '../components/layout/Sidebar'
import DocxEditor from '../components/editor/docx/DocxEditor'
import PptxEditor from '../components/editor/pptx/PptxEditor'
import { useDispatch } from 'react-redux'
import { setDocumentData } from '../redux/slice/documentSlice'
import { setPageLoading } from '../redux/slice/userSlice'

const EditDocument = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [document, setDocument] = useState(null);
    const [documentTextBlocks, setDocumentTextBlocks] = useState([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDocumentById = async () => {
            setLoading(true)
            try {
                const { document, textBlocks } = await documentService.GetDocumentTextBlocks(id)
                setDocument(document);
                setDocumentTextBlocks(textBlocks);
                dispatch(setDocumentData(document));

            } finally {
                setLoading(false)
            }
        }
        fetchDocumentById()
    }, [])

    const HandleMoveToBin = async (id) => {
        await documentService.DocumentSoftDelete(id)
        navigate('/files')
    }

    const HandleSaveFileName = async (fileName, document) => {
        const payload = {
            id: document?._id,
            mimetype: document?.mime_type,
            fileName: fileName
        }
        const response = await documentService.UpdateFileName(payload);
        console.log(document)
        setDocument(response?.document);
        dispatch(setDocumentData(response?.document));
    };

    const handleDocumentUpdate = async () => {
        try {
            dispatch(setPageLoading(true))
            const response = await documentService.UpdateDocument({ id, textBlocks: documentTextBlocks })
            setDocument(response?.document);
            dispatch(setDocumentData(response?.document));
            navigate(`/doc/view/${id}`)
        } finally {
            dispatch(setPageLoading(false))
        }
    }

    return (
        <div className='flex h-full'>
            {/* <DocSidebar document={document} /> */}
            <DetailSidebar onDelete={HandleMoveToBin} onUpdate={handleDocumentUpdate} onSaveFileName={HandleSaveFileName} />
            <div className='w-full h-full flex justify-center ml-16 md:ml-0'>
                <div className='w-1/2 hidden md:block'>
                    <DocumentViewer url={document?.url} mime_type={GetFileExtension(document?.mime_type)} />
                </div>
                <div className='md:w-1/2 w-full'>
                    {
                        GetFileExtension(document?.mime_type) === "docx" &&
                        <DocxEditor textBlocks={documentTextBlocks} setTextBlocks={setDocumentTextBlocks} loading={loading} />
                    }
                    {
                        GetFileExtension(document?.mime_type) === "pptx" &&
                        <PptxEditor textBlocks={documentTextBlocks} setTextBlocks={setDocumentTextBlocks} loading={loading} />
                    }
                </div>
            </div>
        </div>
    )
}

export default EditDocument