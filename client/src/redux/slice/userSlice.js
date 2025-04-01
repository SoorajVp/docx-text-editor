
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
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
            const token = localStorage.getItem("auth_token")
            if (!token) {
                localStorage.setItem("auth_token", action.payload.token)
            }
            state.user_data = action.payload.user;
            state.isFetching = false
        },

        setUserLoggout: (state) => {
            localStorage.removeItem("auth_token")
            state.user_data = null
            state.isFetching = false
        },
    },
});

export const { setPageLoading, setUserDetails, setUserLoggout } = userSlice.actions;

export default userSlice.reducer;
