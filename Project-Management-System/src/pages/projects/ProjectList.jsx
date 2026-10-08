import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteProjectRequest,
  deleteProjectSuccess,
  deleteProjectFailure,
} from "../../features/projects/projectSlice";
import { deleteProject as deleteProjectAPI } from "../../services/projectService";

const statusStyles = {
  planning: "bg-gray-50 text-gray-600",
  active: "bg-yellow-50 text-yellow-600",
  completed: "bg-teal-50 text-teal-600",
  "on-hold": "bg-purple-50 text-purple-600",
};

const progressStyles = {
  planning: "bg-gray-400",
  active: "bg-yellow-400",
  completed: "bg-teal-500",
  "on-hold": "bg-purple-500",
};

const readableStatus = {
  planning: "Planning",
  active: "Active",
  completed: "Completed",
  "on-hold": "On Hold",
};

const ProjectList = ({ projects, onEdit }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        dispatch(deleteProjectRequest());
        await deleteProjectAPI(projectId);
        dispatch(deleteProjectSuccess({ projectId }));
        alert("Project deleted successfully!");
      } catch (err) {
        dispatch(deleteProjectFailure(err.message));
        alert("Failed to delete project: " + err.message);
      }
    }
  };

  const handleViewDetails = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const getProgress = (status) => {
    const progressMap = {
      planning: 20,
      active: 60,
      completed: 100,
      "on-hold": 35,
    };
    return progressMap[status] || 0;
  };

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <div
          key={project._id}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                ✓
              </div>

              <h2 className="text-base font-semibold text-gray-900">
                {project.name}
              </h2>
            </div>

            <span
              className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${statusStyles[project.status] || "bg-gray-50 text-gray-600"}`}
            >
              {readableStatus[project.status] || project.status}
            </span>
          </div>

          <div className="my-5 border-t border-gray-100" />

          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="text-xs text-gray-400">Priority</p>
              <p className="mt-1 text-sm font-medium text-gray-800">
                {project.priority || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Owner</p>
              <p className="mt-1 text-sm font-medium text-gray-800">
                {project.owner?.name || "Unknown"}
              </p>
            </div>

            <div className="col-span-2">
              <p className="text-xs text-gray-400">Description</p>
              <p className="mt-1 text-sm text-gray-700 line-clamp-2">
                {project.description || "No description provided"}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-gray-400">Progress</span>
              <span className="text-xs font-medium text-gray-500">
                {getProgress(project.status)}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all ${progressStyles[project.status] || "bg-gray-400"}`}
                style={{ width: `${getProgress(project.status)}%` }}
              />
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-400">
            <p>
              Created: {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={() => handleViewDetails(project._id)}
              className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              View Details
            </button>

            <button
              onClick={() => onEdit(project)}
              className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-teal-600 hover:bg-teal-50 transition"
            >
              Edit
            </button>

            <button
              onClick={() => handleDeleteProject(project._id)}
              className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
