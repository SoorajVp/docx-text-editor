import React, { useContext, useEffect, useState } from 'react'
import { MainContext } from '../contexts/Provider';
import ContentList from '../components/document/ContentList';
import documentService from '../api/services/document';
import ViewDocument from '../components/document/ViewDocument';

const EditingPage = () => {
    const [fetching, setFetching] = useState(false)
    const { idContext, urlContext, textContext, setTextContext } = useContext(MainContext);

    useEffect(() => {
        if (urlContext?.length === 0) {
            console.error("Document URL is missing.");
            return;
        }

        const fetchAndParseDocument = async () => {
            setFetching(true);
            const url = urlContext[idContext || 0]
            try {
                const data = await documentService.GetDocumentTextBlocks(url)
                setTextContext(data.textBlocks || []);
                console.log("Document loaded successfully!");
            } finally {
                setFetching(false);
            }
        };

        fetchAndParseDocument();
    }, [urlContext, idContext]);

    return (
        <div className='grid lg:grid-cols-2 gap-2 h-full p-1'>
            <ViewDocument url={urlContext[idContext]} />
            <ContentList fetching={fetching} />
        </div>
    )
}

export default EditingPage