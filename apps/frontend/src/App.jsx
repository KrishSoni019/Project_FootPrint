import { Routes, Route } from "react-router-dom";
import LandingPage from "./features/landing/pages/LandingPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import LoginPage from "./features/auth/pages/LoginPage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import CreateWorkspacePage from "./features/workspace/pages/CreateWorkspacePage";
import MembersPage from "./features/members/pages/MembersPage";
import TasksPage from "./features/tasks/pages/TasksPage";

/**
 * App
 * Phase C: auth UI + authenticated dashboard shell + workspace creation + members + tasks wired in.
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/workspace/new" element={<CreateWorkspacePage />} />
      <Route path="/members" element={<MembersPage />} />
      <Route path="/tasks" element={<TasksPage />} />
    </Routes>
  );
}

export default App;
