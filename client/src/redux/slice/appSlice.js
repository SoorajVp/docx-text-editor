
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    darkMode: true,
    openMenu: true
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
        },
        toggleSideMenu: (state, action) => {
            state.openMenu = action.payload;
        },
    },
});

export const { toggleDarkMode, toggleSideMenu } = appSlice.actions;

export default appSlice.reducer;
