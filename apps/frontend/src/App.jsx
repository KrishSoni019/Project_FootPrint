import { Routes, Route } from "react-router-dom";
import LandingPage from "./features/landing/pages/LandingPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import LoginPage from "./features/auth/pages/LoginPage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import CreateWorkspacePage from "./features/workspace/pages/CreateWorkspacePage";

/**
 * App
 * Phase B: auth UI + authenticated dashboard shell + workspace creation wired in.
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/workspace/new" element={<CreateWorkspacePage />} />
    </Routes>
  );
}

export default App;
