import React, { useEffect, useRef, useCallback, useContext } from "react";
import { MainContext } from "../contexts/Provider";

const ContentBlock = ({ block, index }) => {
    const textareaRef = useRef(null);
    const { setTextContext } = useContext(MainContext);

    // Adjust height of the textarea dynamically
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"; // Reset height
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Adjust to scroll height
        }
    }, [block.text]);

    // Handle text change for this specific block
    const handleTextChange = useCallback(
        (value) => {
            setTextContext((prev) => {
                const updatedBlocks = prev.map((b) =>
                    b.id === block.id ? { ...b, text: value } : b
                );
                return updatedBlocks;
            });
        },
        [block.id, setTextContext]
    );

    return (
        <textarea
            ref={textareaRef}
            rows={1}
            value={block.text || ""}
            onChange={(e) => handleTextChange(e.target.value)}
            className="w-full text-sm bg-white dark:bg-black text-black dark:text-neutral-200 border border-gray-300 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-300 outline-none transition duration-300 ease-in-out p-3"
            style={{
                resize: "none",
                overflow: "hidden",
                lineHeight: "1.5",
            }}
        />
    );
};

export default ContentBlock;
 