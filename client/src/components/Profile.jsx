import { googleLogout } from "@react-oauth/google";
import React, { useEffect, useState } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setPageLoading, setUserDetails, setUserLoggout, toggleDarkMode } from "../redux/slice/userSlice";
import userService from "../api/services/user";
import ConfirmationModal from "./modals/AlertModal";

const Profile = ({ name, first_name, last_name, email, picture, theme }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [user, setUser] = useState({
        first_name: first_name || "",
        last_name: last_name || "",
        picture: picture || "",
        email: email || "",
        documents: 0,
        theme: theme || "light",
    });

    useEffect(() => {
        setUser({
            first_name: first_name || "",
            last_name: last_name || "",
            picture: picture || "",
            email: email || "",
            documents: 0,
            theme: theme || "light",
        });
    }, [first_name, last_name, picture, name, theme]);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "theme") {
            console.log(value)
            dispatch(toggleDarkMode(value === 'dark' ? true : false))
        }
        if (files?.[0]) {
            const file = files[0];
            setSelectedImage(file); // Store file for upload
            const imageUrl = URL.createObjectURL(file); // Preview image
            setUser((prevUser) => ({ ...prevUser, picture: imageUrl }));
        } else {
            setUser((prevUser) => ({ ...prevUser, [name]: value }));
        }
    };


    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("first_name", user.first_name);
        formData.append("last_name", user.last_name);
        formData.append("theme", user.theme);

        if (selectedImage) {
            formData.append("picture", selectedImage); // Append image file for upload
        }

        try {
            dispatch(setPageLoading(true))
            const response = await userService.UpdateUserDetails(formData);
            dispatch(setUserDetails({ user: response.user }));
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating user details:", error);
        } finally {
            dispatch(setPageLoading(false))
        }
    };

    const handleLogOut = () => {
        googleLogout();
        dispatch(setUserLoggout());
        navigate("/get-started");
    };

    const HandleDiscard = () => {
        setUser({
            first_name: first_name || "",
            last_name: last_name || "",
            picture: picture || "",
            email: email || "",
            documents: 0,
            theme: theme || "light",
        });
        setIsEditing(false)
    }

    return (
        <div className="h-full w-full flex items-center justify-center p-2">
            <div className="relative w-full bg-white max-w-4xl my-8 md:my-16 flex flex-col-reverse sm:flex-row items-start justify-between space-y-4 sm:space-y-0 sm:space-x-6 px-4 py-8  dark:bg-neutral-950 shadow-lg">

                {/* Profile Details Section */}
                <div className="w-full flex flex-col items-center sm:items-start md:ml-4">
                    <p className="flex text-2xl font-semibold dark:text-gray-200 py-2">
                        {name}
                    </p>

                    <div className="mb-4 text-gray-700 dark:text-gray-300">
                        <table className="min-w-full table-auto border-collapse text-left">
                            <tbody className="space-y-3">
                                <tr>
                                    <td className="pr-5 py-1">First Name</td>
                                    <td className="py-1 min-w-64">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="first_name"
                                                value={user.first_name}
                                                onChange={handleInputChange}
                                                className="block w-full text-sm rounded bg-white dark:bg-black text-black dark:text-neutral-200 border border-gray-400 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-300 outline-none transition duration-500 ease-in-out px-2 py-1.5"
                                            />
                                        ) : (
                                                <p className="py-1"> : {user.first_name}</p>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="pr-5 py-1">Last Name</td>
                                    <td className="py-1 min-w-64">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="last_name"
                                                value={user.last_name}
                                                onChange={handleInputChange}
                                                className="block w-full text-sm rounded bg-white dark:bg-black text-black dark:text-neutral-200 border border-gray-400 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-300 outline-none transition duration-500 ease-in-out px-2 py-1.5"
                                            />
                                        ) : (
                                            <p className="py-1"> : {user.last_name}</p>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="pr-5 py-1">Email ID</td>
                                    {/* <td className="py-1 min-w-64">
                                        <p className="py-1"> : {user.email}</p>
                                    </td> */}
                                    <td className="py-1 min-w-64">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="email"
                                                value={user.email} disabled
                                                className="block w-full text-sm rounded bg-white dark:bg-black text-black dark:text-neutral-200 border border-gray-400 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-300 outline-none transition duration-500 ease-in-out px-2 py-1.5"
                                            />
                                        ) : (
                                            <p className="py-1"> : {user.email}</p>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="pr-5 py-1">Theme</td>
                                    <td className="py-1 min-w-64">
                                        {isEditing ? (
                                            <select
                                                name="theme"
                                                onChange={handleInputChange}
                                                className="block w-full text-sm rounded bg-white dark:bg-black text-black dark:text-neutral-200 border border-gray-400 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-300 outline-none transition duration-500 ease-in-out px-2 py-1.5"
                                                defaultValue={user?.theme || "light"}
                                            >
                                                <option value="dark">Dark</option>
                                                <option value="light">Light</option>
                                            </select>
                                        ) : (
                                            <p className="py-1"> : {user.theme}</p>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {isEditing ? (
                            <div className="flex gap-1 mt-2">
                                <button onClick={HandleDiscard} className="w-full rounded py-1 border border-neutral-400 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-200 text-black dark:text-white transition duration-300 ease-in-out">Cancel</button>
                                <button onClick={handleSubmit} className="w-full rounded py-1 bg-orange-500 hover:bg-orange-500 text-white transition duration-300 ease-in-out">Save Changes</button>
                            </div>
                        ) : (
                            <>
                                <p onClick={() => setIsEditing(true)} className="text-orange-500 hover:text-orange-600 cursor-pointer my-3 transition duration-300 ease-in-out">
                                    Edit account information?
                                </p>
                                    <Link to="/archive" className="text-red-500 hover:text-red-600 cursor-pointer transition duration-300 ease-in-out">
                                    Manage Recently Deleted Files
                                </Link>
                            </>
                        )}

                    </div>
                </div>

                {/* Profile Picture Section */}
                <div className="w-full flex justify-center sm:justify-start sm:w-auto">
                    <div>
                        <img className="object-cover object-center bg-neutral-500 w-52 h-40" src={user?.picture ?? picture} alt="Profile" />
                        <input
                            type="file"
                            accept="image/*"
                            name="picture"
                            className="hidden"
                            id="fileInput"
                            onChange={handleInputChange}
                        />
                        {isEditing ?
                            <button className="w-full rounded border border-neutral-500 mt-2 dark:text-white text-sm py-0.5" onClick={() => document.getElementById("fileInput").click()}>
                                Change Picture
                            </button> :
                            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 justify-center w-full text-sm rounded border border-red-500 mt-2 text-red-700 dark:text-red-500 bg-neutral-100 dark:bg-neutral-900 py-1 font-semibold">
                                Logout <IoLogOutOutline size={20} />
                            </button>
                        }
                    </div>
                </div>
            </div>

            {showModal && (
                <ConfirmationModal
                    action="logout"
                    onConfirm={handleLogOut}
                    onCancel={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default Profile;
