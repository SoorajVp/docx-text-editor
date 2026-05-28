import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPageLoading, setUserDetails } from "../redux/slice/userSlice";
import accessService from "../api/services/access";
import documentService from "../api/services/document";
import userService from "../api/services/user";
import ViewerHeader from "../components/layout/ViewerHeader";
import DocumentViewer from "../components/document/DocViewer";
import DocxEditor from "../components/editor/docx/DocxEditor";
import PptxEditor from "../components/editor/pptx/PptxEditor";
import { GetFileExtension, DownloadFile } from "../utils/helper";
import MiniLoading from "../components/loading/MiniLoading";
import { IoFileTrayFullSharp } from "react-icons/io5";
import Header from "../components/layout/Header";

/* ── Sign-in wall shown when user is not authenticated ── */
const SignInWall = () => (
    <div className="flex flex-col h-screen w-screen bg-white dark:bg-neutral-950">
        {/* Minimal brand header */}
        <header className="flex items-center px-6 py-4 border-b border-gray-100 dark:border-neutral-800 bg-neutral-300 dark:bg-black font-serif">
            <Link to="/get-started" className="flex items-center gap-1 uppercase text-lg font-semibold text-neutral-700 dark:text-gray-200">
                <IoFileTrayFullSharp size={25} />
                <span className="bg-gradient-to-r from-black dark:from-white to-gray-500 dark:to-gray-500 bg-clip-text text-transparent">
                    Documate
                </span>
            </Link>
        </header>

        {/* Content */}
        <div className="flex flex-1 items-center justify-center px-6">
            <div className="flex flex-col items-center gap-5 text-center max-w-sm">
                <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-3xl">
                    🔒
                </div>
                <div>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Sign in to view this document
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        This document is private. You need to be signed in to access it.
                    </p>
                </div>
                <Link
                    to="/get-started"
                    className="px-6 py-2.5 rounded font-medium text-sm bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 transition"
                >
                    Sign In to Continue
                </Link>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                    Don't have an account?{" "}
                    <Link to="/get-started" className="text-orange-500 hover:underline">
                        Get started for free
                    </Link>
                </p>
            </div>
        </div>
    </div>
);

/* ── Main component ── */
const EncryptedViewer = () => {
    const { accessId } = useParams();
    const [searchParams] = useSearchParams();

    const documentId = searchParams.get('doc');
    const dispatch = useDispatch();
    const { user_data, darkMode } = useSelector((store) => store.user);

    const [document, setDocument] = useState(null);
    const [access, setAccess] = useState(null);
    const [textBlocks, setTextBlocks] = useState([]);
    const [restricted, setRestricted] = useState(false);   // user fetch done
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const token = localStorage.getItem("auth_token");
    const permission = access?.permission ?? "viewer";
    const isWrite = permission === "editor";
    const fileExt = GetFileExtension(document?.mime_type);
    const isEditable = access?.enabled;


    /* ── Step 2: load document once user state is resolved ── */
    useEffect(() => {
        if (!accessId) return;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await accessService.GetSharedDocument(accessId, documentId);
                setDocument(res.document);
                setAccess(res.access);
                if (res.restricted) {
                    setRestricted(true);
                } else {
                    if (res.user) {
                        dispatch(setUserDetails({ user: res.user }));
                    }
                }

            } catch (err) {
                setError(err?.response?.data?.message || "Failed to load the shared document.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [accessId]);

    /* ── Step 3: fetch text blocks once we know it's write + editable ── */
    useEffect(() => {
        if (!document || !isEditable) return;
        const fetchBlocks = async () => {
            try {
                const res = await accessService.GetSharedDocumentTextBlocks(accessId);
                setTextBlocks(res.textBlocks || []);
            } catch (err) {
                // leave editor empty
                console.warn("Failed to load document text blocks. Editor will be empty.", err);
            }
        };
        fetchBlocks();
    }, [document, access]);

    const handleEditing = async () => {
        if (permission === "read") {
            alert("You don't have permission to edit this document.");
            return;
        }
        try {
            const response = await accessService.enableFileEditing({ accessId });
            setAccess(response.access);
        } catch (error) {
            console.log('error :>> ', error);
        }

    };

    /* ── Handlers ── */
    const handleSave = async () => {
        if (!isWrite || !document) return;
        setIsSaving(true);
        try {
            dispatch(setPageLoading(true));
            const res = await documentService.UpdateDocument({ id: document._id, textBlocks });
            setDocument(res.document);
        } finally {
            setIsSaving(false);
            dispatch(setPageLoading(false));
        }
    };

    const handleDownload = () => {
        if (document?.url) DownloadFile(document.url, document.file_name);
    };

    /* ── Not logged in → sign-in wall ── */
    if (restricted) return <SignInWall />;

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-white dark:bg-neutral-950">
                <MiniLoading />
            </div>
        );
    }

    /* ── Error ── */
    if (error) {
        return (
            <div className={`flex h-screen w-screen flex-col items-center justify-center gap-4 bg-white dark:bg-neutral-950 px-6 text-center ${darkMode ? "dark" : ""}`}>
                <div className="text-5xl">🔒</div>
                <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Access Denied</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">{error}</p>
                <Link to="/files" className="text-sm text-orange-500 hover:underline">
                    Go to My Documents
                </Link>
            </div>
        );
    }

    /* ── Document view ── */
    return (
        <div className={`flex flex-col h-screen w-screen overflow-hidden bg-white dark:bg-neutral-950 ${darkMode ? "dark" : ""}`}>

            <ViewerHeader
                handleEditing={handleEditing}
                editable={isEditable}
                document={document}
                permission={permission}
                onSave={handleSave}
                onDownload={handleDownload}
                isSaving={isSaving}
            />
            <div className="flex flex-1 overflow-hidden bg-gradient-to-b from-white to-neutral-300 dark:from-neutral-800 dark:to-neutral-950">

                {/* Document preview */}
                <div className={`h-full overflow-auto  ${isEditable ? "hidden md:flex md:w-1/2" : "flex flex-1 justify-center"}`}>
                    <div className={isEditable ? "w-full" : "w-full max-w-3xl mx-auto"}>
                        <DocumentViewer url={document?.url} mime_type={fileExt} />
                    </div>
                </div>

                {/* Editor — write + docx/pptx only */}
                {isEditable && (
                    <div className="md:w-1/2 w-full h-full overflow-auto max-w-3xl mx-auto border-l border-gray-200 dark:border-neutral-800">
                        {fileExt === "docx" && (
                            <DocxEditor textBlocks={textBlocks} setTextBlocks={setTextBlocks} loading={loading} />
                        )}
                        {fileExt === "pptx" && (
                            <PptxEditor textBlocks={textBlocks} setTextBlocks={setTextBlocks} loading={loading} />
                        )}
                    </div>
                )}

                {/* Preview-only notice for write access on non-editable types (pdf) */}
                {isWrite && !isEditable && (
                    <div className="absolute bottom-4 right-4">
                        <span className="px-3 py-1.5 rounded text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                            Preview only — this file type cannot be edited
                        </span>

                    </div>
                )}
            </div>
        </div>
    );
};

export default EncryptedViewer;
