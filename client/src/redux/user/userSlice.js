import { createSlice } from '@reduxjs/toolkit';



const initialState = {
    user: null,
    loading: false,
    error: false,
}

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
    }
});


export const { signInStart, signInSuccess, signInFail } = userSlice.actions;
export default userSlice.reducer;