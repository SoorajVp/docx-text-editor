import React from 'react'
import DocumentUpload from '../components/document/DocumentUpload'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPageLoading } from '../redux/slice/userSlice';
import documentService from '../api/services/document';

const UploadDocument = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFileSubmit = async (file) => {
    try {
      dispatch(setPageLoading(true));
      const formData = new FormData();
      formData.append("document", file);
      await documentService.UploadDocument(formData);
      navigate("/");
    } finally {
      dispatch(setPageLoading(false));
    }
  };

  return (
    <DocumentUpload onSubmit={handleFileSubmit} />
  )
}

export default UploadDocument