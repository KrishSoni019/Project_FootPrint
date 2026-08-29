import { useEffect } from 'react';
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
import { useWorkspace } from '../../workspace/context/WorkspaceContext';

/**
 * DashboardPage
 *
 * Authenticated home. Reads the logged-in user and workspace list from the
 * shared WorkspaceContext, then renders one of a few honest states:
 * loading, error, or the actual data (empty-workspace onboarding vs. a
 * live workspace).
 */
export default function DashboardPage() {
  const navigate = useNavigate();
  const {
    status,
    user,
    projects,
    selectedWorkspace: activeProject,
    setSelectedWorkspaceId,
    reloadWorkspace,
    clearWorkspace,
  } = useWorkspace();

  // The context itself doesn't redirect (it's shared across public and
  // protected pages), so each protected page still guards itself.
  useEffect(() => {
    if (status !== 'loading' && !getAuthToken()) {
      navigate('/login');
    }
  }, [status, navigate]);

  const handleLogout = () => {
    clearAuthToken();
    clearWorkspace();
    navigate('/login');
  };

  if (status === 'loading' || !getAuthToken()) {
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
            onClick={reloadWorkspace}
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-900/60 px-4 py-2 text-sm font-medium text-paper-100 transition-colors hover:bg-ink-800"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      user={user}
      projects={projects}
      activeProject={activeProject}
      onSelectProject={setSelectedWorkspaceId}
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
