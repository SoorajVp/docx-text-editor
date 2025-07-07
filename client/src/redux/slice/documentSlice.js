
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    document: {},
    isLoading: false
};

const documentSlice = createSlice({
    name: 'document',
    initialState,
    reducers: {
        setDocumentData: (state, action) => {
            state.document = action.payload;
        },
       
    },
});

export const { setDocumentData } = documentSlice.actions;

export default documentSlice.reducer;
