import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoFileTrayFullSharp, IoNotifications } from "react-icons/io5";
import { IoMdDownload } from "react-icons/io";
import { MdSave } from "react-icons/md";
import { RiEditFill } from "react-icons/ri";
import { getFileNameOG } from "../../utils/helper";

const ViewerHeader = ({ handleEditing, editable, document, permission, onSave, onDownload, isSaving }) => {
    const { user_data } = useSelector((store) => store.user);
    const isWrite = permission === "write";

    return (
        <header className="flex w-full items-center justify-between bg-neutral-300 dark:bg-black px-6 py-3 font-serif border-b border-neutral-400 dark:border-neutral-800 z-20 flex-shrink-0">

            {/* ── Left: logo + doc name ── */}
            <div className="flex items-center gap-3 min-w-0">
                <Link
                    to="/get-started"
                    className="flex items-center gap-1 flex-shrink-0 uppercase text-lg font-semibold text-neutral-700 dark:text-gray-200"
                >
                    <IoFileTrayFullSharp size={25} />
                    <span className="bg-gradient-to-r from-black dark:from-white to-gray-500 dark:to-gray-500 bg-clip-text text-transparent">
                        Documate
                    </span>
                </Link>

                {document?.file_name && (
                    <>
                        <span className="text-neutral-400 dark:text-neutral-600 flex-shrink-0 text-lg">/</span>
                        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300 truncate max-w-[200px]">
                            {getFileNameOG(document.file_name)}
                        </span>
                    </>
                )}
            </div>

            {/* ── Right: actions + profile ── */}
            <div className="flex items-center gap-2 dark:text-white text-neutral-800 flex-shrink-0">

                {/* Download — always */}
                <button
                    onClick={onDownload}
                    title="Download document"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded transition
                        bg-gray-200 dark:bg-neutral-800
                        text-gray-700 dark:text-gray-200
                        hover:bg-gray-300 dark:hover:bg-neutral-700
                        border border-gray-300 dark:border-neutral-700"
                >
                    <IoMdDownload size={16} />
                    <span className="hidden sm:inline">Download</span>
                </button>

                {/* Save Changes — write only */}
                {(user_data && editable) && (
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        title="Save changes"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded font-medium transition
                            bg-orange-500 text-white
                            hover:bg-orange-600 active:bg-orange-700
                            disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MdSave size={16} />
                        <span className="hidden sm:inline">
                            {isSaving ? "Saving…" : "Save Changes"}
                        </span>
                    </button>
                )}

                {/* Permission badge */}
                {(user_data && editable) ? (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold
                        bg-orange-100 dark:bg-orange-900/30
                        text-orange-700 dark:text-orange-300
                        border border-orange-200 dark:border-orange-800">
                        <RiEditFill size={12} />
                        Can Edit
                    </span>
                ) : (
                    permission === "write" ?
                        <button onClick={handleEditing} className="flex items-center gap-1.5 px-2.5 py-2 rounded text-xs font-semibold
                        bg-orange-100 dark:bg-orange-900/30
                        text-orange-700 dark:text-orange-300
                        border border-orange-200 dark:border-orange-800">
                            <RiEditFill size={12} />
                            Enable Editing
                        </button> :

                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold
                        bg-gray-100 dark:bg-neutral-800
                        text-gray-500 dark:text-gray-400
                        border border-gray-200 dark:border-neutral-700">
                            Read Only
                        </span>

                )}

                {/* Notifications */}
                <IoNotifications
                    className="text-2xl hover:text-orange-700 dark:hover:text-orange-300 cursor-pointer transition-all ease-in-out duration-300"
                />

                {/* Profile / Sign In */}
                {user_data ? (
                    <Link
                        to="/profile"
                        className="flex group items-center gap-2 border border-white hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-400 p-1 rounded-full transition-all ease-in-out duration-300"
                    >
                        <h3 className="pl-4 group-hover:text-orange-700 dark:group-hover:text-orange-300 cursor-pointer transition-all ease-in-out duration-300 text-sm">
                            Profile
                        </h3>
                        <img
                            src={user_data?.picture || "https://ionicframework.com/docs/img/demos/avatar.svg"}
                            alt="profile"
                            className="h-8 w-8 rounded-full object-cover object-center"
                        />
                    </Link>
                ) : (
                    <Link
                        to="/get-started"
                        className="px-4 py-1.5 text-sm rounded font-medium transition
                            bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700"
                    >
                        Sign In
                    </Link>
                )}
            </div>
        </header>
    );
};

export default ViewerHeader;
