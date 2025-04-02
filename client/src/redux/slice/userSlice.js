
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    darkMode: localStorage.getItem("dark_mode"),
    user_data: null,
    isFetching: true
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

        setPageLoading: (state) => {
            state.isFetching = !state.isFetching
        },

        setUserDetails: (state, action) => {
            console.log(action.payload)
            const token = localStorage.getItem("auth_token")
            if (!token) {
                localStorage.setItem("auth_token", action.payload.token)
            }
            localStorage.setItem("dark_mode", action.payload.user.theme === "dark" ? true: false)
            state.darkMode = action.payload.user.theme === "dark" ? true : false;
            state.user_data = action.payload.user;
            state.isFetching = false
        },

        toggleDarkMode: (state, action) => {
            localStorage.setItem("dark_mode", action.payload)
            state.darkMode = action.payload;
        },

        setUserLoggout: (state) => {
            localStorage.removeItem("auth_token")
            state.user_data = null
            state.isFetching = false
        },
    },
});

export const { setPageLoading, setUserDetails, setUserLoggout, toggleDarkMode } = userSlice.actions;

export default userSlice.reducer;
