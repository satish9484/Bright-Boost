import { configureStore } from '@reduxjs/toolkit'
import reduxApiMiddleware from './Middleware'
import thunk from 'redux-thunk'
import AuthSlice from './AuthSlice'
import UserSlice from './UserSlice'

export const store = configureStore({
    reducer: {
        auth: AuthSlice,
        user: UserSlice,
    },
    middleware: [thunk, reduxApiMiddleware]
}) 