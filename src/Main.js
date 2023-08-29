import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import App from "./App";
import Log from "./Log";

import useAuth from "./useAuth";

function Main() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* If user is logged in, redirect to dashboard. Otherwise, show Log component */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <Log />}
        />

        {/* Only show App component (or dashboard) when user is logged in */}
        <Route
          path="/dashboard"
          element={user ? <App /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default Main;
