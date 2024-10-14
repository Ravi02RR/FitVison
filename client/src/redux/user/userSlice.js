import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    loading: false,
    error: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = false;
        },
        signInFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        signOutSuccess: (state) => {
            state.user = null;
            state.loading = false;
            state.error = false;
        },
    }
});


export const { signInStart, signInSuccess, signInFail, signOutSuccess } = userSlice.actions;


export default userSlice.reducer;
