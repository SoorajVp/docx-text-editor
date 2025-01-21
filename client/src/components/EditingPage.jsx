import React, { useContext, useEffect, useState } from 'react'
import ViewDocument from './ViewDocument'
import apiClient from '../api/axios';
import { MainContext } from '../contexts/Provider';
import Header from './Header';
import ContentList from './ContentList';

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
                const response = await apiClient.get(`/get-text-blocks?documentUrl=${url}`);
                setTextContext(response.data.textBlocks || []);
                console.log("Document loaded successfully!");
            } catch (error) {
                alert("Failed to load the document. Please try again.");
            } finally {
                setFetching(false);
            }
        };

        fetchAndParseDocument();
    }, [urlContext, idContext]);

    return (
        <div className="h-screen flex flex-col">
            <Header />
            <main className="flex-1 overflow-y-auto p-1">
                <div className='grid lg:grid-cols-2 gap-2 h-full p-1'>
                    <ViewDocument url={urlContext[idContext]} />
                    <ContentList fetching={fetching} />
                </div>
            </main>
        </div>
    )
}

export default EditingPage