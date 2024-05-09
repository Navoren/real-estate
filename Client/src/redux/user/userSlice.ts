/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
    currentUser: any | null;
    accessToken: any | null;
    refreshToken: any | null;
    error: any | null;
    loading: boolean;
}

const initialState: UserState = {
    currentUser: null,
    accessToken: null,
    refreshToken: null,
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
        SignInSuccess: (state, action: PayloadAction<any>) => {
            state.currentUser = action.payload.user
            state.accessToken = action.payload.accessToken
            state.refreshToken = action.payload.refreshToken
            state.error = null
            state.loading = false

            document.cookie = `accessToken=${state.accessToken}; path=/;`
        },
        SignInFailure: (state, action: PayloadAction<any>) => {
            state.error = action.payload.user
            state.loading = false
        },
        UpdateUserStart: (state) => {
            state.loading = true
        },
        UpdateUserSuccess: (state, action: PayloadAction<any>) => {
            state.currentUser = action.payload.user
            state.error = null
            state.loading = false
        },
        UpdateUserFailure: (state, action: PayloadAction<any>) => {
            state.error = action.payload.user
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
        DeleteUserFailure: (state, action: PayloadAction<any>) => {       
            state.error = action.payload.user
            state.loading = false
        },
        SignOutStart: (state) => {
            state.loading = true
        },
        SignOutSuccess: (state) => {
            state.currentUser = null
            state.accessToken = null
            state.refreshToken = null
            state.error = null
            state.loading = false
            document.cookie = `accessToken=${state.accessToken}; path=/;`
        },
        SignOutFailure: (state, action: PayloadAction<any>) => {
            state.error = action.payload.user
            state.loading = false
        },
    }
});

export const { SignInFailure, SignInStart, SignInSuccess , UpdateUserFailure, UpdateUserStart, UpdateUserSuccess, DeleteUserStart, DeleteUserSuccess, DeleteUserFailure, SignOutSuccess, SignOutStart, SignOutFailure} = userSlice.actions;

export default userSlice.reducer;
export const selectCurrentUser = (state: any) => state.userSlice.user;
export const selectCurrentToken = (state: any) => state.userSlice.accessToken;
