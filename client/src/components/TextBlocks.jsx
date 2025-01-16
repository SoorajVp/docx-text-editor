import React, { useContext, useEffect, useRef, useCallback } from "react";
import { MainContext } from "../contexts/Provider";

const TextBlocks = ({ fetching }) => {
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

    // Handle text change for a specific block using its unique id
    const handleTextChange = useCallback(
        (id, value) => {
            setTextContext((prev) => {
                const updatedBlocks = prev.map((block) =>
                    block.id === id ? { ...block, text: value } : block
                );
                return updatedBlocks;
            });
        },
        [setTextContext]
    );

    return (
        <div className="flex-1 overflow-y-auto">
            {fetching ? (
                <div className="text-center text-gray-300 pt-6">Loading document...</div>
            ) : textContext?.length > 0 ? (
                textContext.map((block, index) => (
                    <textarea
                        ref={(el) => (textareaRefs.current[index] = el)}
                        key={block.id} // Use block.id as the unique key
                        value={block.text || ""} // Set value from block.text
                        onChange={(e) => handleTextChange(block.id, e.target.value)} // Update text using block.id
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
                <div className="text-center text-gray-300 pt-6">No text blocks to edit.</div>
            )}
        </div>
    );
};

export default TextBlocks;
