import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface userState {
    currentUser: null | string,
    error: null | string,
    loading: boolean,
    
}

const initialState: userState = {
    currentUser: null,
    error: null,
    loading: false,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        SignInStart: (state) => {
            state.loading = true
        },
        SignInSuccess: (state, action: PayloadAction<string>) => {
            state.currentUser = action.payload
            state.error = null
            state.loading = false
    
        },
        SignInFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload
            state.loading = false
        },
    }
});

export const { SignInFailure, SignInStart, SignInSuccess} = userSlice.actions

export default userSlice.reducer