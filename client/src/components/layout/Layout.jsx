import React, { useEffect } from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUserDetails } from '../../redux/slice/userSlice'
import axios from 'axios'
import authService from '../../api/services/auth'
import Loading from '../Loading'
import userService from '../../api/services/user'

const Layout = () => {
    const { darkMode } = useSelector((store) => store.app)
    const { user_data, isFetching } = useSelector((store) => store.user)
    const dispatch = useDispatch()

    useEffect(() => {

        const fetchUserDetails = async () => {
            const { user } = await userService.GetUserDetails()
            dispatch(setUserDetails({ user }))
        }
        if (!user_data) {
            fetchUserDetails()
        }
    }, [])

    return (
        <div className={`h-screen flex flex-col ${darkMode && 'dark'}`}>
            <Header />
            <main className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-neutral-300 dark:from-neutral-800 dark:to-neutral-950 ">
                {/* {
                    isFetching ?
                        <Loading /> :
                        <Outlet />
                } */}
                <Outlet />
            </main>
        </div>
    )
}

export default Layout