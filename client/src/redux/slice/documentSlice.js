
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    document: {}
};

const documentSlice = createSlice({
    name: 'document',
    initialState,
    reducers: {
        setDocumentData: (state, action) => {
            console.log('action.payload', action.payload)
            state.document = action.payload;
        },
       
    },
});

export const { setDocumentData } = documentSlice.actions;

export default documentSlice.reducer;
