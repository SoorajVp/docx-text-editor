import React from 'react'

const Profile = () => {
    return (
        <div className="h-full w-full flex items-center justify-center ">
            <div
                className="relative w-full max-w-4xl my-8 md:my-16 flex flex-col items-start space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 px-4 py-8 border border-gray-400 dark:border-gray-700 dark:bg-neutral-950 shadow-lg">


                <div className="w-full flex justify-center sm:justify-start sm:w-auto">
                    <img className="object-cover w-32 h-32 mt-3 mx-3 " src="https://lh3.googleusercontent.com/a/ACg8ocLqDRA8vYEKX7dcfB8puGYeLzdlhW_9wtymXUsK5StYR_KbPQ=s96-c" />
                </div>

                <div className="w-full sm:w-auto flex flex-col items-center sm:items-start">

                    <div className='flex justify-between w-full'>
                        <p className="font-display mb-2 text-2xl font-semibold dark:text-gray-200" itemprop="author">
                            Prajwal Hallale
                        </p>
                        <button className='secondary-button'>Edit Informations</button>
                    </div>

                    <div className="mb-4 text-gray-700 dark:text-gray-300">
                        <table class="min-w-full table-auto border-collapse text-left">
                            <tbody>
                                <tr class="">
                                    <td class="pr-5 py-1">First Name</td>
                                    <td class="pr-5 py-1">: johndoe@example.com</td>
                                </tr>
                                <tr>
                                    <td class="pr-5 py-1">Last Name</td>
                                    <td class="pr-5 py-1">: janesmith@example.com</td>
                                </tr>
                                <tr>
                                    <td class="pr-5 py-1">Email ID</td>
                                    <td class="pr-5 py-1">
                                        <input type="text" value={"samwilson@example.com"} />
                                    </td>
                                </tr>
                                <tr>
                                    <td class="pr-5 py-1">Documents</td>
                                    <td class="pr-5 py-1">: 67</td>
                                </tr>
                                <tr>
                                    <td class="pr-5 py-1">Theme</td>
                                    <td class="pr-5 py-1">: Dark</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex gap-4">

                        <a title="youtube url" href="https://www.youtube.com/@mcqmate" target="_blank"
                            rel="noopener noreferrer">
                            <svg className="h-6 w-6 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M20.5949 4.45999C21.5421 4.71353 22.2865 5.45785 22.54 6.40501C22.9982 8.12001 23 11.7004 23 11.7004C23 11.7004 23 15.2807 22.54 16.9957C22.2865 17.9429 21.5421 18.6872 20.5949 18.9407C18.88 19.4007 12 19.4007 12 19.4007C12 19.4007 5.12001 19.4007 3.405 18.9407C2.45785 18.6872 1.71353 17.9429 1.45999 16.9957C1 15.2807 1 11.7004 1 11.7004C1 11.7004 1 8.12001 1.45999 6.40501C1.71353 5.45785 2.45785 4.71353 3.405 4.45999C5.12001 4 12 4 12 4C12 4 18.88 4 20.5949 4.45999ZM15.5134 11.7007L9.79788 15.0003V8.40101L15.5134 11.7007Z"
                                    stroke="currentColor" stroke-linejoin="round"></path>
                            </svg>
                        </a>

                        <a title="website url" href="https://mcqmate.com/" target="_blank" rel="noopener noreferrer">
                            <svg className="h-6 w-6 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418">
                                </path>
                            </svg>
                        </a>

                    </div>
                    <p>Prajwal is a versatile content writer with a strong background in web development.</p>
                </div>
{/* asdasd */}
            </div>

        </div>
    )
}

export default Profile