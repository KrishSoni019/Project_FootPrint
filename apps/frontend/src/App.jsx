import { Routes, Route } from "react-router-dom";
import LandingPage from "./features/landing/pages/LandingPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import LoginPage from "./features/auth/pages/LoginPage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import CreateWorkspacePage from "./features/workspace/pages/CreateWorkspacePage";
import MembersPage from "./features/members/pages/MembersPage";
import TasksPage from "./features/tasks/pages/TasksPage";
import ActivitiesPage from "./features/activities/pages/ActivitiesPage";
import TimelinePage from "./features/timeline/pages/TimelinePage";

/**
 * App
 * Phase E: unified contribution timeline UI wired in alongside auth,
 * dashboard shell, workspace creation, members, tasks, and activities.
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
      <Route path="/activities" element={<ActivitiesPage />} />
      <Route path="/timeline" element={<TimelinePage />} />
    </Routes>
  );
}

export default App;
