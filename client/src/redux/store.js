import { configureStore } from '@reduxjs/toolkit'
import appSlice from './slice/appSlice'
import userSlice from './slice/userSlice'
import documentSlice from './slice/documentSlice'

// ...
const store = configureStore({
    reducer: {
        app: appSlice,
        user: userSlice,
        document: documentSlice
    },
})


export default store