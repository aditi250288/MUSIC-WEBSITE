import React, { useState, useEffect } from "react";
import "./LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token in localStorage:", token);
    if (token) {
      console.log("User is already logged in");
      // Optionally, redirect to a logged-in page:
      // navigate('/library');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        username,
        password,
      });
      const { token, user } = response.data;

      console.log("Login successful, token:", token);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      if (rememberMe) {
        localStorage.setItem("username", username);
      } else {
        localStorage.removeItem("username");
      }
      navigate("/library");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate("/forgot-password");
  };

  return (
    <div className="login-page">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          {error && <p className="error">{error}</p>}
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaLock className="icon" />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <div className="options-below-login">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="forgot-password"
            >
              Forgot Password?
            </button>
          </div>
          <div className="register-link">
            <p>
              Don't have an account?{" "}
              <Link to="/register">Create an account</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;