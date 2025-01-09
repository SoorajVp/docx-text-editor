import React, { useContext, useState } from 'react'
import apiClient from '../api/axios';
import { MainContext } from '../contexts/Provider';
import { IoIosRedo, IoIosUndo } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [saving, setSaving] = useState(false);
  const { urlContext, idContext, textContext, setUrlContext, setIdContext } = useContext(MainContext);
  const navigate = useNavigate()

  // Save changes to the document
  const handleSubmit = async () => {
    const url = urlContext[idContext]
    if (!url || textContext.length === 0) {
      alert("Cannot submit: either the URL or text blocks are missing.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        documentUrl: url,
        updatedTextBlocks: textContext,
      };
      console.log('idContext, urlContext   =>', idContext, urlContext)
      const response = await apiClient.post("/update-document", payload);
      let data = urlContext
      data.unshift(response.data?.updatedUrl)
      localStorage.setItem("url_value", JSON.stringify(data));
      alert("Document saved successfully!");
      // setUrlContext(data);
      // setIdContext(0)
      location.reload()
      console.log('idContext, urlContext  last =>', idContext, urlContext)
    } catch (error) {
      alert("Failed to save document. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Handle discard
  const onDiscard = () => {
    localStorage.removeItem("url_value")
    location.href = "/" ;
  }

  // Handle Undo
  const handleUndo = () => {
    if (idContext < urlContext.length - 1) {
      setIdContext((prevIndex) => Number(prevIndex) + 1);
      navigate(`?id=${Number(idContext) + 1}`)
    }
  };

  // Handle Redo
  const handleRedo = () => {
    if (idContext > 0) {
      setIdContext((prevIndex) => prevIndex - 1);
      navigate(`?id=${Number(idContext) - 1}`)
    }
  };

  return (
    <header className='px-6 py-3 w-full flex justify-between items-center bg-black'>
      <div className='flex items-center gap-2'>

        <h2 className='text-gray-200 font-semibold text-lg'>
          Edit Document
        </h2>
      </div>
      <div className='space-x-2 flex items-center'>
        {
          idContext != urlContext.length - 1 &&
          <button
            className="border border-slate-400 text-gray-200 bg-neutral-800 p-2 hover:border-orange-400 hover:bg-neutral-700 transition duration-500 ease-in-out"
            onClick={handleUndo} >
            <IoIosUndo size={15} />
          </button>
        }
        {
          idContext != 0 &&
          <button
            className="border border-slate-400 text-gray-200 bg-neutral-800 p-2 hover:border-orange-400 hover:bg-neutral-700 transition duration-500 ease-in-out"
            onClick={handleRedo} >
            <IoIosRedo size={15} />
          </button>
        }
        <button className="secondary-button" onClick={onDiscard}>
          Discard
        </button>
        <button className="primary-button" disabled={saving} onClick={handleSubmit}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </header >
  )
}

export default Header