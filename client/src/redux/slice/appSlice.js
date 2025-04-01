
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    darkMode: localStorage.getItem("dark_mode") === "dark" ? true : false,
    openMenu: true
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        toggleDarkMode: (state, action) => {
            state.darkMode = action.payload;
        },
        toggleSideMenu: (state, action) => {
            state.openMenu = action.payload;
        },
    },
});

export const { toggleDarkMode, toggleSideMenu } = appSlice.actions;

export default appSlice.reducer;
