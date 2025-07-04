import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';  // Import Quill styles

const CreateDocument = () => {
    const [editorContent, setEditorContent] = useState('');
    const [documentTitle, setDocumentTitle] = useState('example');

    // Configure the modules for react-quill
    const modules = {
        toolbar: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ align: [] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            ['link', 'image'],
            [{ script: 'sub' }, { script: 'super' }],
            [{ direction: 'rtl' }],
            ['clean'],
        ],
    };

    // Handle content change in Quill editor
    const handleEditorChange = (value) => {
        console.log('value', value)
        setEditorContent(value);
    };

    // Handle form submission (you can modify this to suit your backend)
    const handleSubmit = () => {
        if (!documentTitle || !editorContent) {
            return;
        }
        // Assuming you're going to send the content to an API or process it here
        console.log('Document Submitted:', { documentTitle, editorContent });
    };

    const saveAsDocument = async (format) => {
        const editor = quillRef.current.getEditor();
        const html = editor.root.innerHTML;
        const delta = editor.getContents();

        try {
            const response = await fetch('/api/export', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: html,
                    format: format
                }),
            });

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `document.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (error) {
            console.error('Export failed:', error);
        }
      };

    return (
        <div className="max-w-5xl container mx-auto py-2 h-full overflow-hidden p-2">
            <h1 className="text-2xl font-bold mb-2 text-neutral-700 dark:text-neutral-200">Create a New Document</h1>
            <label htmlFor="documentTitle" className="block text-XS text-neutral-500">File Name</label>
            <div className='flex items-center justify-between gap-2'> 
                <div className="w-full">
                    <input
                        type="text"
                        id="documentTitle"
                        className="w-full p-3 py-1 text-base bg-white dark:bg-black text-black dark:text-neutral-200 border border-gray-400 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-300 outline-none transition duration-300"
                        value={documentTitle}
                        onChange={(e) => setDocumentTitle(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 h-min">
                    <button onClick={handleSubmit} className="px-5 py-1.5 text-nowrap border-2 text-xs md:text-sm font-medium border-orange-500 text-orange-500 hover:bg-orange-600 hover:text-white transition duration-300 ease-in-out">
                        Download
                    </button>
                    <button onClick={saveAsDocument} className="px-5 py-1.5 text-nowrap border-2 text-xs md:text-sm font-medium border-orange-500 text-orange-500 hover:bg-orange-600 hover:text-white transition duration-300 ease-in-out">
                        Save Document
                    </button>
                   
                </div>
            </div>
           

            <div className="mt-2 bg-white ">
                <ReactQuill
                    value={editorContent}
                    onChange={handleEditorChange}   
                    modules={modules}
                    placeholder="Start typing your document content here..."
                    theme="snow"
                    className=" h-[70vh] shadow-lg bg-white "
                />
            </div>


        </div>
    );
};

export default CreateDocument;
