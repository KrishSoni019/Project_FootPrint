import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import DashboardHeader from '../components/DashboardHeader';
import WorkspaceOverview from '../components/WorkspaceOverview';
import SetupChecklist from '../components/SetupChecklist';
import EvidenceOverview from '../components/EvidenceOverview';
import AnalysisEmptyState from '../components/AnalysisEmptyState';
import RecentActivity from '../components/RecentActivity';
import EmptyWorkspaceState from '../components/EmptyWorkspaceState';
import { getAuthToken, clearAuthToken } from '../../auth/utils/authToken';

const API_BASE_URL = 'http://localhost:5000';

/**
 * DashboardPage
 *
 * Authenticated home. Loads the real logged-in user and real workspace
 * list, then renders one of a few honest states: loading, error, or the
 * actual data (empty-workspace onboarding vs. a live workspace).
 */
export default function DashboardPage() {
  const navigate = useNavigate();

  const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'ready'
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);

  const loadDashboard = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      navigate('/login');
      return;
    }

    setStatus('loading');

    try {
      const [meResponse, projectsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/api/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (meResponse.status === 401 || projectsResponse.status === 401) {
        clearAuthToken();
        navigate('/login');
        return;
      }

      if (!meResponse.ok || !projectsResponse.ok) {
        throw new Error('Failed to load dashboard data.');
      }

      const meData = await meResponse.json();
      const projectsData = await projectsResponse.json();

      const loadedUser = meData.user ?? meData;
      const loadedProjects = projectsData.projects ?? [];

      setUser(loadedUser);
      setProjects(loadedProjects);
      setActiveProjectId((current) => current ?? loadedProjects[0]?.id ?? null);
      setStatus('ready');
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      setStatus('error');
    }
  }, [navigate]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleLogout = () => {
    clearAuthToken();
    navigate('/login');
  };

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950">
        <div className="flex flex-col items-center gap-3">
          <span
            aria-hidden="true"
            className="h-8 w-8 animate-spin rounded-full border-2 border-ink-700 border-t-signal-400"
          />
          <p className="font-mono text-xs uppercase tracking-wider text-mist-500">
            Loading workspace…
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950 px-6">
        <div className="flex max-w-sm flex-col items-center text-center">
          <AlertTriangle className="h-8 w-8 text-flag-400" aria-hidden="true" />
          <h1 className="mt-4 font-display text-xl font-medium text-paper-100">
            Couldn't load your dashboard
          </h1>
          <p className="mt-2 text-sm text-mist-400">
            There was a problem reaching the server. Check your connection
            and try again.
          </p>
          <button
            type="button"
            onClick={loadDashboard}
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-900/60 px-4 py-2 text-sm font-medium text-paper-100 transition-colors hover:bg-ink-800"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  const activeProject =
    projects.find((project) => project.id === activeProjectId) ?? projects[0] ?? null;

  return (
    <DashboardLayout
      user={user}
      projects={projects}
      activeProject={activeProject}
      onSelectProject={setActiveProjectId}
      onLogout={handleLogout}
    >
      {!activeProject ? (
        <EmptyWorkspaceState />
      ) : (
        <>
          <DashboardHeader
            userName={user?.name}
            projectName={activeProject.name}
            role={activeProject.role}
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <WorkspaceOverview project={activeProject} />
              <EvidenceOverview />
              <AnalysisEmptyState />
              <RecentActivity />
            </div>

            <div className="lg:col-span-1">
              <SetupChecklist />
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
