import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.scss";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

const AuthForm = ({ type, onSubmit, error, clearError }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    clearError?.();
    setFormErrors({});
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
  }, [type, clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = "Email is required";
      toast.error(errors.email);
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
      toast.error(errors.email);
    }

    if (!formData.password) {
      errors.password = "Password is required";
      toast.error(errors.password);
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      toast.error(errors.password);
    }

    if (type === "signup") {
      if (!formData.name) {
        errors.name = "Name is required";
        toast.error(errors.name);
      }

      if (!formData.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
        toast.error(errors.confirmPassword);
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords don't match";
        toast.error(errors.confirmPassword);
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    clearError?.();

    try {
      const submitData = type === "login"
        ? { email: formData.email, password: formData.password }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password
          };

      await onSubmit(submitData);
    } catch (err) {
      setFormErrors(prev => ({
        ...prev,
        form: err.message || "An error occurred"
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{type === "login" ? "Login" : "Sign Up"}</h2>
        {error && <div className="auth-error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {type === "signup" && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={formErrors.name ? "error" : ""}
                placeholder="Enter your name"
                disabled={isLoading}
              />
              {formErrors.name && (
                <span className="error-message">{formErrors.name}</span>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={formErrors.email ? "error" : ""}
              placeholder="Enter your Email"
              disabled={isLoading}
            />
            {formErrors.email && (
              <span className="error-message">{formErrors.email}</span>
            )}
          </div>

          <div className="form-group password-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={formErrors.password ? "error" : ""}
                placeholder="Enter your Password"
                disabled={isLoading}
              />
              <span
                className="toggle-password-icon"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
            {formErrors.password && (
              <span className="error-message">{formErrors.password}</span>
            )}
          </div>


          {type === "signup" && (
            <div className="form-group password-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={formErrors.confirmPassword ? "error" : ""}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                <span
                  className="toggle-password-icon"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
              {formErrors.confirmPassword && (
                <span className="error-message">{formErrors.confirmPassword}</span>
              )}
            </div>
          )}


          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="auth-spinner"></div>
            ) : (
              type === "login" ? "Login" : "Sign Up"
            )}
          </button>
        </form>

        <div className="auth-footer">
          {type === "login" ? (
            <p>Don't have an account? <span onClick={() => navigate("/signup")}>Sign up</span></p>
          ) : (
            <p>Already have an account? <span onClick={() => navigate("/login")}>Login</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
