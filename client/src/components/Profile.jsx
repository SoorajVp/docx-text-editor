import { googleLogout } from "@react-oauth/google";
import React, { useEffect, useState } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPageLoading, setUserDetails, setUserLoggout } from "../redux/slice/userSlice";
import userService from "../api/services/user";

const Profile = ({ name, given_name, family_name, email, picture, theme }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null); // Holds the new file for upload
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [user, setUser] = useState({
        firstName: given_name || "",
        lastName: family_name || "",
        picture: picture || "",
        email: email || "",
        documents: 0,
        theme: theme || "light",
    });

    useEffect(() => {
        setUser({
            firstName: given_name || "",
            lastName: family_name || "",
            picture: picture || "",
            email: email || "",
            documents: 0,
            theme: theme || "light",
        });
    }, [given_name, family_name, picture, name, theme]);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;

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
        formData.append("given_name", user.firstName);
        formData.append("family_name", user.lastName);
        formData.append("theme", user.theme);

        if (selectedImage) {
            formData.append("picture", selectedImage); // Append image file for upload
        }

        try {
            dispatch(setPageLoading())
            const response = await userService.UpdateUserDetails(formData);
            dispatch(setUserDetails({ user: response.user }));
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating user details:", error);
        }
    };

    const handleLogOut = () => {
        googleLogout();
        dispatch(setUserLoggout());
        navigate("/get-started");
    };

    const HandleDiscard = () => {
        setUser({
            firstName: given_name || "",
            lastName: family_name || "",
            picture: picture || "",
            email: email || "",
            documents: 0,
            theme: theme || "light",
        });
        setIsEditing(false)
    }

    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="relative w-full bg-white max-w-4xl my-8 md:my-16 flex flex-col-reverse sm:flex-row items-start justify-between space-y-4 sm:space-y-0 sm:space-x-6 px-4 py-8 border border-gray-400 dark:border-gray-700 dark:bg-neutral-950 shadow-lg">

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
                                                name="firstName"
                                                value={user.firstName}
                                                onChange={handleInputChange}
                                                className="block w-full text-sm bg-white dark:bg-black text-black dark:text-neutral-200 border border-gray-400 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-300 outline-none transition duration-500 ease-in-out px-2 py-1.5"
                                            />
                                        ) : (
                                            <p className="py-1"> : {user.firstName}</p>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="pr-5 py-1">Last Name</td>
                                    <td className="py-1 min-w-64">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={user.lastName}
                                                onChange={handleInputChange}
                                                className="block w-full text-sm bg-white dark:bg-black text-black dark:text-neutral-200 border border-gray-400 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-300 outline-none transition duration-500 ease-in-out px-2 py-1.5"
                                            />
                                        ) : (
                                            <p className="py-1"> : {user.lastName}</p>
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
                                                className="block w-full text-sm bg-white dark:bg-black text-black dark:text-neutral-200 border border-gray-400 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-300 outline-none transition duration-500 ease-in-out px-2 py-1.5"
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
                                                className="block w-full text-sm bg-white dark:bg-black text-black dark:text-neutral-200 border border-gray-400 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-300 outline-none transition duration-500 ease-in-out px-2 py-1.5"
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
                                <button onClick={HandleDiscard} className="w-full py-1 border border-neutral-400 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-200 text-black dark:text-white transition duration-300 ease-in-out">Cancel</button>
                                <button onClick={handleSubmit} className="w-full py-1 bg-orange-500 hover:bg-orange-500 text-white transition duration-300 ease-in-out">Save Changes</button>
                            </div>
                        ) : (
                            <p onClick={() => setIsEditing(true)} className="text-orange-500 hover:text-orange-600 cursor-pointer mt-3 transition duration-300 ease-in-out">
                                Edit account information?
                            </p>
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
                            <button className="w-full border border-neutral-500 mt-2 dark:text-white text-sm py-0.5" onClick={() => document.getElementById("fileInput").click()}>
                                Change Picture
                            </button> :
                            <button onClick={handleLogOut} className="flex items-center gap-2 justify-center w-full border border-red-500 mt-2 text-red-700 dark:text-red-500 bg-neutral-100 dark:bg-neutral-900 py-1 font-semibold text-base">
                                Logout <IoLogOutOutline size={20} />
                            </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
