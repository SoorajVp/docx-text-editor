import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Layout = () => {
    const { darkMode } = useSelector((store) => store.app)
    console.log("dark mode",)
    return (
        <div className={`h-screen flex flex-col ${darkMode && 'dark'}`}>
            <Header />
            <main className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-neutral-300 dark:from-neutral-800 dark:to-neutral-950 ">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout