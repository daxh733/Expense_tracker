import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/login.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Analytics from "./pages/analytics.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access")
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />

        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/analytics"
          element={isAuthenticated ? <Analytics /> : <Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
