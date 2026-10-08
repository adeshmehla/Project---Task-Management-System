import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import {
  clearError,
  loginFailure,
  loginRequest,
  loginSuccess,
} from "../features/auth/authSlice";
import { login as loginAPI } from "../services/authService";
export const Login = () => {
  const { isLoading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [validationError, setvalidationError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((preState) => ({ ...preState, [name]: value }));
    setvalidationError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validation
    if ((!formData.email.trim())) {
      setvalidationError("email is required");
    }
    if (!formData.password) {
      setvalidationError("Password is required");
    }
    try {
        dispatch(loginRequest())
      const response = await loginAPI(formData.email, formData.password);
      dispatch(loginSuccess(response));
      setFormData({ email: "", password: "" });
      navigate("/dashboard");
    } catch (error) {
      dispatch(loginFailure(error));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-sm text-gray-500">Login to your account</p>
        </div>

        {/* Error Messages */}
        {(error || validationError) && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error || validationError}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3
                         text-gray-900 outline-none
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3
                         text-gray-900 outline-none
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 py-3
                       text-sm font-semibold text-white
                       hover:bg-blue-700
                       focus:outline-none focus:ring-2
                       focus:ring-blue-500 focus:ring-offset-2
                       transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <NavLink
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Register
          </NavLink>
        </p>
      </div>
    </div>
  );
};
