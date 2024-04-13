import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
    currentUser: string | null;
    error: string | null;
    loading: boolean;
}

const initialState: UserState = {
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
        UpdateUserStart: (state) => {
            state.loading = true
        },
        UpdateUserSuccess: (state, action: PayloadAction<string>) => {
            state.currentUser = action.payload
            state.error = null
            state.loading = false
        },
        UpdateUserFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload
            state.loading = false
        },
        DeleteUserStart: (state) => {         
            state.loading = true
        },
        DeleteUserSuccess: (state) => {
            state.currentUser = null
            state.error = null
            state.loading = false
        },
        DeleteUserFailure: (state, action: PayloadAction<string>) => {       
            state.error = action.payload
            state.loading = false
        },
        SignOutStart: (state) => {
            state.loading = true
        },
        SignOutSuccess: (state) => {
            state.currentUser = null
            state.error = null
            state.loading = false
        },
        SignOutFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload
            state.loading = false
        },
    }
});

export const { SignInFailure, SignInStart, SignInSuccess , UpdateUserFailure, UpdateUserStart, UpdateUserSuccess, DeleteUserStart, DeleteUserSuccess, DeleteUserFailure, SignOutSuccess, SignOutStart, SignOutFailure} = userSlice.actions;

export default userSlice.reducer;
