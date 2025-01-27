import React, { useState } from "react";

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);

    // Example user data (could be fetched from an API)
    const [user, setUser] = useState({
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        documents: 67,
        theme: "Dark",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="relative w-full bg-white max-w-4xl my-8 md:my-16 flex flex-col-reverse sm:flex-row items-start justify-between space-y-4 sm:space-y-0 sm:space-x-6 px-4 py-8 border border-gray-400 dark:border-gray-700 dark:bg-neutral-950 shadow-lg">
                {/* Profile Details Section */}
                <div className="w-full flex flex-col items-center sm:items-start md:ml-4">
                    <p className="flex text-2xl font-semibold dark:text-gray-200 py-2">
                        {user.firstName} {user.lastName}
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
                                    <td className="py-1 min-w-64">
                                        {isEditing ? (
                                            <input
                                                type="email"
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
                                    <td className="pr-5 py-1">Documents</td>
                                    <td className="py-1 min-w-64">
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                name="email"
                                                value={user.documents}
                                                disabled
                                                className="block w-full text-sm bg-white dark:bg-black text-black dark:text-neutral-200 border border-gray-400 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-300 outline-none transition duration-500 ease-in-out px-2 py-1.5"
                                            />
                                        ) : (
                                            <p className="py-1"> : {user.documents}</p>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="pr-5 py-1">Theme</td>
                                    <td className="py-1 min-w-64">
                                        {isEditing ? (
                                            <select
                                                name="theme"
                                                id="dropdown"
                                                className="block w-full text-sm bg-white dark:bg-black text-black dark:text-neutral-200 border border-gray-400 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-300 outline-none transition duration-500 ease-in-out px-2 py-1.5"
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
                        {
                            isEditing ?
                                <div className="flex gap-1 mt-2">
                                    <button onClick={() => setIsEditing(false)} className="w-full py-1 border border-neutral-400 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-200 text-black dark:text-white transition duration-300 ease-in-ou">Cancel</button>
                                    <button className="w-full py-1 bg-orange-500 hover:bg-orange-500 text-white transition duration-300 ease-in-ou">Save Changes</button>
                                </div>
                                : <p
                                    onClick={() => setIsEditing(true)}
                                    className="text-orange-500  hover:text-orange-600 cursor-pointer mt-3 transition duration-300 ease-in-out"
                                >
                                    Edit account informations ?
                                </p>
                        }

                    </div>
                </div>

                {/* Profile Picture Section */}
                <div className="w-full flex justify-center sm:justify-start sm:w-auto">
                    <div>
                        <img
                            className="object-cover w-52 h-40"
                            src="https://lh3.googleusercontent.com/a/ACg8ocLqDRA8vYEKX7dcfB8puGYeLzdlhW_9wtymXUsK5StYR_KbPQ=s96-c"
                            alt="Profile"
                        />
                        <button className="w-full border border-neutral-500 mt-2 dark:text-white text-sm py-0.5">Change Picture</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
