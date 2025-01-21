import React, { useContext, useEffect, useRef, useCallback } from "react";
import { MainContext } from "../contexts/Provider";
import ContentBlock from "./Textblock";

const ContentList = ({ fetching }) => {
    const textareaRefs = useRef([]);
    const { textContext, setTextContext } = useContext(MainContext);

    // Adjust height of textareas dynamically
    useEffect(() => {
        textContext?.forEach((_, index) => {
            if (textareaRefs.current[index]) {
                textareaRefs.current[index].style.height = "auto"; // Reset height
                textareaRefs.current[index].style.height = `${textareaRefs.current[index].scrollHeight}px`; // Adjust to scroll height
            }
        });
    }, [textContext]);

    return (
        <div className="flex-1 overflow-y-auto">
            {fetching ? (
                <div className="text-center text-gray-300 pt-6">Loading document...</div>
            ) : textContext?.length > 0 ? (
                textContext.map((block, index) => (
                    <ContentBlock block={block} key={block.id} />
                ))
            ) : (
                <div className="text-center text-gray-300 pt-6">No text blocks to edit.</div>
            )}
        </div>
    );
};

export default ContentList;