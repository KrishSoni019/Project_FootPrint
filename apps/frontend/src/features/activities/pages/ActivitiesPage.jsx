import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Plus, RefreshCw } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import ActivityList from '../components/ActivityList';
import CreateActivityModal from '../components/CreateActivityModal';
import { getAuthToken, clearAuthToken } from '../../auth/utils/authToken';
import { useWorkspace } from '../../workspace/context/WorkspaceContext';

const API_BASE_URL = 'http://localhost:5000';

/**
 * ActivitiesPage
 *
 * Workspace (user, projects, selected project) now comes from the shared
 * WorkspaceContext. This page only owns activity-log-specific state and
 * reloads it whenever the selected workspace changes.
 *
 * GET  /api/projects/:id/activities
 * POST /api/projects/:id/activities (via CreateActivityModal, create mode)
 * PATCH /api/activities/:id         (via CreateActivityModal, edit mode)
 */
export default function ActivitiesPage() {
  const navigate = useNavigate();
  const {
    status: workspaceStatus,
    user,
    projects,
    selectedWorkspace: project,
    setSelectedWorkspaceId,
    reloadWorkspace,
    clearWorkspace,
  } = useWorkspace();

  const [activityDataStatus, setActivityDataStatus] = useState('loading'); // 'loading' | 'error' | 'ready'
  const [activities, setActivities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    if (workspaceStatus !== 'loading' && !getAuthToken()) {
      navigate('/login');
    }
  }, [workspaceStatus, navigate]);

  const loadActivities = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      navigate('/login');
      return;
    }

    if (!project) {
      setActivities([]);
      setActivityDataStatus('ready');
      return;
    }

    setActivityDataStatus('loading');
    setActionError('');

    try {
      const activitiesResponse = await fetch(
        `${API_BASE_URL}/api/projects/${project.id}/activities`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (activitiesResponse.status === 401) {
        clearAuthToken();
        clearWorkspace();
        navigate('/login');
        return;
      }

      if (!activitiesResponse.ok) {
        throw new Error('Failed to load activities.');
      }

      const activitiesData = await activitiesResponse.json();
      setActivities(activitiesData.activities ?? []);
      setActivityDataStatus('ready');
    } catch (error) {
      console.error('Failed to load activities:', error);
      setActivityDataStatus('error');
    }
  }, [navigate, project, clearWorkspace]);

  // Re-fetch activities whenever the selected workspace changes (or on
  // first mount once the workspace context has resolved one).
  useEffect(() => {
    if (workspaceStatus === 'ready') {
      loadActivities();
    }
  }, [workspaceStatus, project?.id, loadActivities]);

  const status =
    workspaceStatus === 'error' || activityDataStatus === 'error'
      ? 'error'
      : workspaceStatus === 'loading' || activityDataStatus === 'loading'
        ? 'loading'
        : 'ready';

  const handleLogout = () => {
    clearAuthToken();
    clearWorkspace();
    navigate('/login');
  };

  const handleActivityCreated = (newActivity) => {
    setActivities((current) => [newActivity, ...current]);
  };

  const handleActivityUpdated = (updatedActivity) => {
    setActivities((current) =>
      current.map((activity) => (activity.id === updatedActivity.id ? updatedActivity : activity))
    );
  };

  const openCreateModal = () => {
    setEditingActivity(null);
    setIsModalOpen(true);
  };

  const openEditModal = (activity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingActivity(null);
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
            Loading activities…
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
            Couldn't load activities
          </h1>
          <p className="mt-2 text-sm text-mist-400">
            There was a problem reaching the server. Check your connection
            and try again.
          </p>
          <button
            type="button"
            onClick={workspaceStatus === 'error' ? reloadWorkspace : loadActivities}
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
      activeProject={project}
      onSelectProject={setSelectedWorkspaceId}
      onLogout={handleLogout}
    >
      {!project ? (
        <div className="flex flex-col items-center px-4 py-16 text-center">
          <p className="text-sm text-mist-400">
            You don't have a workspace yet.
          </p>
          <Link
            to="/dashboard"
            className="mt-3 text-sm font-medium text-signal-400 hover:text-signal-500"
          >
            Back to dashboard
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h1 className="font-display text-2xl font-medium text-paper-100 sm:text-3xl">
                Activity
              </h1>
              <p className="mt-1.5 text-sm text-mist-400">
                Non-code work logged for {project.name}.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-signal-500 px-4 py-2 text-sm font-semibold text-ink-950 transition-all duration-150 hover:bg-signal-400 hover:shadow-glow-amber focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-400/50"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Log Activity
            </button>
          </div>

          {actionError && (
            <div
              role="alert"
              className="mt-4 rounded-lg border border-flag-500/20 bg-flag-500/10 px-4 py-3 text-sm text-flag-400"
            >
              {actionError}
            </div>
          )}

          <div className="mt-8">
            {activities.length === 0 ? (
              <div className="rounded-xl border border-dashed border-ink-700 px-6 py-16 text-center">
                <p className="text-sm text-mist-400">
                  No activity logged yet. Record research, documentation, testing,
                  design, or meeting work to get evidence-based credit for it.
                </p>
              </div>
            ) : (
              <ActivityList activities={activities} onEdit={openEditModal} />
            )}
          </div>

          <CreateActivityModal
            projectId={project.id}
            isOpen={isModalOpen}
            onClose={closeModal}
            activity={editingActivity}
            onActivityCreated={handleActivityCreated}
            onActivityUpdated={handleActivityUpdated}
          />
        </>
      )}
    </DashboardLayout>
  );
}
