import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  project: null,
  token: localStorage.getItem("token") || null,
  isLoading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    // Register
    allProjectsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    allProjectsCreateSuccess: (state, action) => {
      state.isLoading = false;
      state.project = action.payload.project;
      state.error = null;
    },
    allProjectsCreateFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Login
    getProjectRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getProjectSuccess: (state, action) => {
      state.isLoading = false;
      state.project = action.payload.project;
      state.token = action.payload.token;
      state.error = null;
      // Save token to localStorage
      localStorage.setItem("token", action.payload.token);
    },
    getProjectFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  registerRequest,
  registerSuccess,
  registerFailure,
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;