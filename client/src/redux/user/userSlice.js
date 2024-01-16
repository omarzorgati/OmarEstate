import { createSlice } from "@reduxjs/toolkit";


//initialisation
const initialState = {
    //before the login
    currentUser: null,
    error:null,
    loading:false,
};
// slice :managing a specific piece of the application state and includes the reducer function and action creators.
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.loading = false;
            // this is the data we get from the backend as a response
            state.currentUser = action.payload;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //we need to add more for the updated user
        updateUserStart: (state) => {
            state.loading = true;
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
         },
         updateUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
         
         },
         deleteUserStart : (state) => {
            state.loading = true;
         },
         deleteUserSuccess : (state, action) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
         },
         deleteUserFailure : (state, action) => {
            state.loading = false;
            state.error = action.payload;
         },
         signoutUserStart : (state) => {
            state.loading = true;
         },
         signoutUserSuccess : (state, action) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
         },
         signoutUserFailure : (state, action) => {
            state.loading = false;
            state.error = action.payload;
         },
    }
})
//they are coming from the createSlice function
export const { signInStart, signInSuccess, signInFailure,
updateUserStart, updateUserSuccess, updateUserFailure,
deleteUserFailure,deleteUserStart,deleteUserSuccess,
signoutUserFailure,signoutUserStart,signoutUserSuccess } = userSlice.actions;
export default userSlice.reducer;


