import React, { useContext, useEffect, useRef } from 'react'
import { MainContext } from '../contexts/Provider';

const TextBlocks = ({ fetching, handleTextChange }) => {
    const textareaRefs = useRef([]);
    const { textContext } = useContext(MainContext);

    // Adjust height of each textarea dynamically
    useEffect(() => {
        textContext?.forEach((_, index) => {
            if (textareaRefs.current[index]) {
                textareaRefs.current[index].style.height = "auto";
                textareaRefs.current[index].style.height = `${textareaRefs.current[index].scrollHeight}px`;
            }
        });
    }, [textContext]);

    return (
        <div className="flex-1 overflow-y-auto">
            {fetching ? (
                <div className="text-center text-gray-300 pt-6">Loading document...</div>
            ) : textContext.length > 0 ? (
                textContext.map((block, index) => (
                    <textarea
                        ref={(el) => (textareaRefs.current[index] = el)}
                        key={index}
                        value={block}
                        onChange={(e) => handleTextChange(index, e.target.value)}
                        className="w-full text-sm text-gray-200 border border-gray-700 focus:border-orange-300 outline-none transition duration-500 ease-in-out p-2 mb-1"
                        style={{
                            resize: "none",
                            overflow: "hidden",
                            backgroundColor: "#000",
                            lineHeight: "1.5",
                        }}
                    />
                ))
            ) : (
                <div className="text-center text-gray-300 pt-6"> No text blocks to edit.</div>
            )}
        </div>
    )
}

export default TextBlocks