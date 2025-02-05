import React, { useContext, useEffect, useRef, useCallback, useState } from "react";
import apiClient from "../../api/axios";
import { MainContext } from "../../contexts/Provider";
import { useNavigate } from "react-router-dom";
import { IoIosRedo, IoIosUndo } from "react-icons/io";
import { TbReload } from "react-icons/tb";
import { FiDownload } from "react-icons/fi";
import toast from "react-hot-toast";
import ContentBlock from "../Textblock";
import documentService from "../../api/services/document";


const ContentList = ({ fetching }) => {
    const textareaRefs = useRef([]);
    const [saving, setSaving] = useState(false);
    const { urlContext, idContext, textContext, setUrlContext, setIdContext } =
        useContext(MainContext);
    const navigate = useNavigate();

    // Adjust height of textareas dynamically
    useEffect(() => {
        textContext?.forEach((_, index) => {
            if (textareaRefs.current[index]) {
                textareaRefs.current[index].style.height = "auto"; // Reset height
                textareaRefs.current[index].style.height = `${textareaRefs.current[index].scrollHeight}px`; // Adjust to scroll height
            }
        });
    }, [textContext]);


    // Save changes to the document
    const handleSubmit = async () => {
        const url = urlContext[idContext];
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

            const { updatedUrl } = await documentService.UpdateDocument(payload)
            // Update context immutably
            setUrlContext((prevUrls) => [updatedUrl, ...prevUrls]);
            setIdContext(0);
            localStorage.setItem(
                "url_value",
                JSON.stringify([updatedUrl, ...urlContext]),
            );
        } finally {
            setSaving(false);
        }
    };

    // Handle discard
    const onDiscard = () => {
        setUrlContext([]);
        setIdContext(0);
        localStorage.removeItem("url_value");

        location.href = "/";
        // toast.success("Changes discarded", {
        //   style: {
        //     border: '1px solid #fca03d',
        //     borderRadius: '0px',
        //     padding: '8px',
        //     color: '#fff',
        //     backgroundColor: '#1a1a1a',
        //     width: "13rem"
        //   },
        //   icon: "✔️"
        // });
    };

    // Handle Undo
    const handleUndo = () => {
        toast.dismiss();
        if (idContext < urlContext.length - 1) {
            setIdContext((prevIndex) => Number(prevIndex) + 1);
            navigate(`?id=${Number(idContext) + 1}`);
            toast("Changes Reverted", {
                style: {
                    border: "1px solid #fca03d",
                    borderRadius: "0px",
                    padding: "8px",
                    color: "#fff",
                    backgroundColor: "#1a1a1a",
                    width: "11rem",
                },
                icon: "➖",
            });
        }
    };

    // Handle Redo
    const handleRedo = () => {
        toast.dismiss();
        if (idContext > 0) {
            setIdContext((prevIndex) => prevIndex - 1);
            navigate(`?id=${Number(idContext) - 1}`);
            toast("Redo Changes", {
                style: {
                    border: "1px solid #fca03d",
                    borderRadius: "0px",
                    padding: "8px",
                    color: "#fff",
                    backgroundColor: "#1a1a1a",
                    width: "11rem",
                },
                icon: "➕",
            });
        }
    };

    const handleDownload = async () => {
        try {
            // Show a loading toast while downloading
            const loadingToastId = toast.loading("Document downloading...", {
                style: {
                    border: "1px solid #fca03d",
                    borderRadius: "0px",
                    padding: "8px",
                    color: "#fff",
                    backgroundColor: "#1a1a1a",
                },
                iconTheme: {
                    primary: "#fcc481",
                    secondary: "#ff9417",
                },
            });

            const url = urlContext[idContext];
            const fileName = url.split("/").pop();

            // Fetch the file
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }

            const blob = await response.blob();

            // Create a download link
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();

            // Clean up
            URL.revokeObjectURL(link.href);

            // Update toast to success
            toast.dismiss(loadingToastId); // Dismiss the loading toast
            toast.success("Download completed successfully!", {
                style: {
                    border: "1px solid #fca03d",
                    borderRadius: "0px",
                    padding: "8px",
                    color: "#fff",
                    backgroundColor: "#1a1a1a",
                },
                icon: "✔️",
            });
        } catch (err) {
            // Remove loading toast and show error toast
            toast.dismiss();
            toast.error("Download failed. Please try again.", {
                style: {
                    border: "1px solid #fca03d",
                    borderRadius: "0px",
                    padding: "8px",
                    color: "#fff",
                    backgroundColor: "#1a1a1a",
                },
                iconTheme: {
                    primary: "#ff1e1e",
                    secondary: "#FFFAEE",
                },
            });
            console.error("Download failed:", err);
        }
    };



    return (
        <div className="h-full overflow-hidden">
            <div className="flex items-center justify-end space-x-2 pb-1">
                {idContext != urlContext?.length - 1 && (
                    <button
                        className="border border-slate-400 bg-neutral-800 p-2 text-gray-200 transition duration-500 ease-in-out hover:border-orange-400 hover:bg-neutral-700"
                        onClick={handleUndo}
                    >
                        <IoIosUndo size={15} />
                    </button>
                )}
                {idContext != 0 && (
                    <button
                        className="border border-slate-400 bg-neutral-800 p-2 text-gray-200 transition duration-500 ease-in-out hover:border-orange-400 hover:bg-neutral-700"
                        onClick={handleRedo}
                    >
                        <IoIosRedo size={15} />
                    </button>
                )}
                <button
                    className="border border-slate-400 bg-neutral-800 p-2 text-gray-200 transition duration-500 ease-in-out hover:border-orange-400 hover:bg-neutral-700"
                    onClick={handleDownload}
                >
                    <FiDownload size={15} />
                </button>
                <button
                    className="border border-slate-400 bg-neutral-800 p-2 text-gray-200 transition duration-500 ease-in-out hover:border-orange-400 hover:bg-neutral-700"
                    onClick={() => location.reload()}
                >
                    <TbReload size={15} />
                </button>
                <button className="secondary-button" onClick={onDiscard}>
                    Discard
                </button>
                <button
                    className="primary-button"
                    disabled={saving}
                    onClick={handleSubmit}
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <div className="h-full overflow-y-scroll">
                {fetching ? (
                    <div className="text-center text-gray-700 dark:text-gray-300 pt-6">Loading document...</div>
                ) : textContext?.length > 0 ? (
                    textContext.map((block, index) => (
                        <ContentBlock block={block} key={block.id} />
                    ))
                ) : (
                    <div className="text-center text-gray-300 pt-6">No text blocks to edit.</div>
                )}
            </div>
        </div>
    );
};

export default ContentList;