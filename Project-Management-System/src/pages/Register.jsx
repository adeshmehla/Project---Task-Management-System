import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  registerRequest,
  registerSuccess,
  registerFailure,
  clearError,
} from "../features/auth/authSlice";
import { register as registerAPI } from "../services/authService";

export const Register = () => {
  const { isLoading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [validationError, setvalidationError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((preState) => ({ ...preState, [name]: value }));
    setvalidationError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setvalidationError("name is required");
      return;
    }
    if (!formData.email.trim()) {
      setvalidationError("email is required");
      return;
    }
  
    if (formData.password.length < 6) {
      setvalidationError("password should be more then 6 charater");
      return;
    }

    if (formData.confirmPassword !== formData.password){
      setvalidationError("password do not match");
      return;
    }
    try {
      dispatch(registerRequest());
      const response = await registerAPI(
        formData.name,
        formData.email,
        formData.password,
      );
      dispatch(registerSuccess(response));
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      prompt("register Successful");
      navigate("/dashboard");
    } catch (error) {
      dispatch(registerFailure(error.message));
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-2 text-sm text-gray-500">Register to get started</p>
        </div>

        {/* Error Messages */}
        {(error || validationError) && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error || validationError}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3
                         text-gray-900 outline-none
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

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
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3
                         text-gray-900 outline-none
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3
                         text-gray-900 outline-none
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Register button */}
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
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};
