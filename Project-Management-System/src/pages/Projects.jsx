import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProjectList from "./projects/ProjectList";
import {
  fetchProjectsRequest,
  fetchProjectsSuccess,
  fetchProjectsFailure,
  createProjectRequest,
  createProjectSuccess,
  createProjectFailure,
  updateProjectRequest,
  updateProjectSuccess,
  updateProjectFailure,
} from "../features/projects/projectSlice";
import {
  getAllProjects,
  createProject as createProjectAPI,
  updateProject as updateProjectAPI,
} from "../services/projectService";

const emptyProjectForm = {
  name: "",
  description: "",
  status: "planning",
  priority: "medium",
};

export const Projects = () => {
  const dispatch = useDispatch();
  const { projects, isLoading, error } = useSelector((state) => state.projects);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [formData, setFormData] = useState(emptyProjectForm);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated]);

  const fetchProjects = async () => {
    try {
      dispatch(fetchProjectsRequest());
      const response = await getAllProjects();
      dispatch(fetchProjectsSuccess(response));
    } catch (err) {
      dispatch(fetchProjectsFailure(err.message));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setEditingProjectId(null);
    setFormData(emptyProjectForm);
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setEditingProjectId(null);
    setFormData(emptyProjectForm);
    setShowModal(true);
  };

  const openEditModal = (project) => {
    setIsEditMode(true);
    setEditingProjectId(project._id);
    setFormData({
      name: project.name,
      description: project.description || "",
      status: project.status || "planning",
      priority: project.priority || "medium",
    });
    setShowModal(true);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Project name is required");
      return;
    }

    try {
      if (isEditMode && editingProjectId) {
        dispatch(updateProjectRequest());
        const response = await updateProjectAPI(editingProjectId, formData);
        dispatch(updateProjectSuccess(response));
        alert("Project updated successfully!");
      } else {
        dispatch(createProjectRequest());
        const response = await createProjectAPI(formData);
        dispatch(createProjectSuccess(response));
        alert("Project created successfully!");
      }

      closeModal();
    } catch (err) {
      if (isEditMode) {
        dispatch(updateProjectFailure(err.message));
      } else {
        dispatch(createProjectFailure(err.message));
      }
      alert(err.message);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredProjects = projects.filter((project) => {
    const projectName = project.name || "";
    const matchesSearch = projectName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = status === "All" || project.status === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {error && (
        <div className="mb-4 rounded-lg border border-red-400 bg-red-100 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and organize all your team's projects in one place
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="rounded-lg bg-teal-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-600 transition"
        >
          + Add Project
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-teal-400"
        >
          <option value="All">All Status</option>
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="on-hold">On Hold</option>
        </select>
      </div>

      {isLoading && (
        <div className="py-10 text-center">
          <p className="text-gray-500">Loading projects...</p>
        </div>
      )}

      {!isLoading && filteredProjects.length === 0 && (
        <div className="py-10 text-center">
          <p className="text-gray-500">
            {projects.length === 0
              ? "No projects yet. Create your first project!"
              : "No projects match your filters."}
          </p>
        </div>
      )}

      {!isLoading && filteredProjects.length > 0 && (
        <ProjectList projects={filteredProjects} onEdit={openEditModal} />
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              {isEditMode ? "Edit Project" : "Create New Project"}
            </h2>

            <form onSubmit={handleProjectSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Enter project name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Enter project description"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  rows="3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-teal-500"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-teal-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-lg border border-gray-300 py-2 text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 rounded-lg bg-teal-500 py-2 text-white hover:bg-teal-600 transition disabled:opacity-50"
                >
                  {isLoading ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
