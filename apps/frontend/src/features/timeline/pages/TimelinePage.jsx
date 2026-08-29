import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import TimelineList from '../components/TimelineList';
import { getAuthToken, clearAuthToken } from '../../auth/utils/authToken';
import { useWorkspace } from '../../workspace/context/WorkspaceContext';

const API_BASE_URL = 'http://localhost:5000';

/**
 * TimelinePage
 *
 * Workspace (user, projects, selected project) now comes from the shared
 * WorkspaceContext. This page only owns timeline-specific state and
 * reloads it whenever the selected workspace changes.
 *
 * GET /api/projects/:id/timeline
 *
 * Read-only view: the timeline is a projection over Task and ManualActivity
 * data that already exists, so unlike Tasks/Activities there's no create
 * modal or mutation here.
 */
export default function TimelinePage() {
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

  const [timelineDataStatus, setTimelineDataStatus] = useState('loading'); // 'loading' | 'error' | 'ready'
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (workspaceStatus !== 'loading' && !getAuthToken()) {
      navigate('/login');
    }
  }, [workspaceStatus, navigate]);

  const loadTimeline = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      navigate('/login');
      return;
    }

    if (!project) {
      setEvents([]);
      setTimelineDataStatus('ready');
      return;
    }

    setTimelineDataStatus('loading');

    try {
      const timelineResponse = await fetch(
        `${API_BASE_URL}/api/projects/${project.id}/timeline`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (timelineResponse.status === 401) {
        clearAuthToken();
        clearWorkspace();
        navigate('/login');
        return;
      }

      if (!timelineResponse.ok) {
        throw new Error('Failed to load timeline.');
      }

      const timelineData = await timelineResponse.json();
      setEvents(timelineData.timeline ?? []);
      setTimelineDataStatus('ready');
    } catch (error) {
      console.error('Failed to load timeline:', error);
      setTimelineDataStatus('error');
    }
  }, [navigate, project, clearWorkspace]);

  // Re-fetch the timeline whenever the selected workspace changes (or on
  // first mount once the workspace context has resolved one).
  useEffect(() => {
    if (workspaceStatus === 'ready') {
      loadTimeline();
    }
  }, [workspaceStatus, project?.id, loadTimeline]);

  const status =
    workspaceStatus === 'error' || timelineDataStatus === 'error'
      ? 'error'
      : workspaceStatus === 'loading' || timelineDataStatus === 'loading'
        ? 'loading'
        : 'ready';

  const handleLogout = () => {
    clearAuthToken();
    clearWorkspace();
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
            Loading timeline…
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
            Couldn't load the timeline
          </h1>
          <p className="mt-2 text-sm text-mist-400">
            There was a problem reaching the server. Check your connection
            and try again.
          </p>
          <button
            type="button"
            onClick={workspaceStatus === 'error' ? reloadWorkspace : loadTimeline}
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
          <div>
            <h1 className="font-display text-2xl font-medium text-paper-100 sm:text-3xl">
              Timeline
            </h1>
            <p className="mt-1.5 text-sm text-mist-400">
              Every task and activity event for {project.name}, newest first.
            </p>
          </div>

          <div className="mt-8">
            {events.length === 0 ? (
              <div className="rounded-xl border border-dashed border-ink-700 px-6 py-16 text-center">
                <p className="text-sm text-paper-100">No contribution activity yet.</p>
                <p className="mt-1.5 text-sm text-mist-400">
                  Tasks and manual activities will appear here as your team works.
                </p>
              </div>
            ) : (
              <TimelineList events={events} />
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
