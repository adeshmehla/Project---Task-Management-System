import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    // Fetch projects
    fetchProjectsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchProjectsSuccess: (state, action) => {
      state.isLoading = false;
      state.projects = action.payload.projects || [];
      state.error = null;
    },
    fetchProjectsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch single project
    fetchProjectRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchProjectSuccess: (state, action) => {
      state.isLoading = false;
      state.currentProject = action.payload.project || null;
      state.error = null;
    },
    fetchProjectFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create project
    createProjectRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createProjectSuccess: (state, action) => {
      state.isLoading = false;
      state.projects.push(action.payload.project);
      state.error = null;
    },
    createProjectFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update project
    updateProjectRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateProjectSuccess: (state, action) => {
      state.isLoading = false;
      const index = state.projects.findIndex(
        (p) => p._id === action.payload.project._id
      );
      if (index !== -1) {
        state.projects[index] = action.payload.project;
      }
      state.currentProject = action.payload.project;
      state.error = null;
    },
    updateProjectFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Delete project
    deleteProjectRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteProjectSuccess: (state, action) => {
      state.isLoading = false;
      state.projects = state.projects.filter(
        (p) => p._id !== action.payload.projectId
      );
      state.error = null;
    },
    deleteProjectFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchProjectsRequest,
  fetchProjectsSuccess,
  fetchProjectsFailure,
  fetchProjectRequest,
  fetchProjectSuccess,
  fetchProjectFailure,
  createProjectRequest,
  createProjectSuccess,
  createProjectFailure,
  updateProjectRequest,
  updateProjectSuccess,
  updateProjectFailure,
  deleteProjectRequest,
  deleteProjectSuccess,
  deleteProjectFailure,
  clearError,
} = projectSlice.actions;

export default projectSlice.reducer;
