import React, { createContext, useState } from 'react';

export const MainContext = createContext();

const ContextProvider = ({ children }) => {
    // State to hold the context value
    const [textContext, setTextContext] = useState([]);
    const [urlContext, setUrlContext] = useState([])
    const [idContext, setIdContext] = useState(0)

    // Function to update context
    // const updateContext = (newData) => {
    //     setTextContext(newData);
    // };

    return (
        <MainContext.Provider value={{ textContext, setTextContext, urlContext, setUrlContext, idContext, setIdContext }}>
            {children}
        </MainContext.Provider>
    );
};

export default ContextProvider;
