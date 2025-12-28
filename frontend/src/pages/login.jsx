import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login/", {
        username,
        password,
      });

      // store tokens (MATCHES BACKEND)
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // 🔥 THIS WAS THE MISSING PIECE
      setIsAuthenticated(true);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-600/70 via-indigo-500/70 to-purple-600/70">
      <div className="w-full max-w-md px-4">
        <form
          onSubmit={handleLogin}
          className="bg-white/95 backdrop-blur rounded-2xl shadow-xl ring-1 ring-black/5 p-8"
        >
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-gray-500">Sign in to continue</p>
          </div>

          {error && (
            <p className="text-red-600 text-sm mb-4 text-center font-medium">
              {error}
            </p>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="you@example"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex justify-center items-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-4 py-2.5 shadow-sm transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
