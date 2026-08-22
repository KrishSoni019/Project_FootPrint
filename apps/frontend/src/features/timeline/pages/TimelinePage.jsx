import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import TimelineList from '../components/TimelineList';
import { getAuthToken, clearAuthToken } from '../../auth/utils/authToken';

const API_BASE_URL = 'http://localhost:5000';

/**
 * TimelinePage
 *
 * Same "default to the first project" pattern as TasksPage/ActivitiesPage —
 * the app doesn't persist a globally-selected workspace yet, so this lands
 * on projects[0] for now.
 *
 * GET /api/projects/:id/timeline
 *
 * Read-only view: the timeline is a projection over Task and ManualActivity
 * data that already exists, so unlike Tasks/Activities there's no create
 * modal or mutation here.
 */
export default function TimelinePage() {
  const navigate = useNavigate();

  const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'ready'
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [events, setEvents] = useState([]);

  const loadTimeline = useCallback(async () => {
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
        throw new Error('Failed to load workspace data.');
      }

      const meData = await meResponse.json();
      const projectsData = await projectsResponse.json();

      const loadedUser = meData.user ?? meData;
      const loadedProjects = projectsData.projects ?? [];
      const activeProject = loadedProjects[0] ?? null;

      setUser(loadedUser);
      setProjects(loadedProjects);
      setProject(activeProject);

      if (activeProject) {
        const timelineResponse = await fetch(
          `${API_BASE_URL}/api/projects/${activeProject.id}/timeline`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (timelineResponse.status === 401) {
          clearAuthToken();
          navigate('/login');
          return;
        }

        if (!timelineResponse.ok) {
          throw new Error('Failed to load timeline.');
        }

        const timelineData = await timelineResponse.json();
        setEvents(timelineData.timeline ?? []);
      } else {
        setEvents([]);
      }

      setStatus('ready');
    } catch (error) {
      console.error('Failed to load timeline:', error);
      setStatus('error');
    }
  }, [navigate]);

  useEffect(() => {
    loadTimeline();
  }, [loadTimeline]);

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
            onClick={loadTimeline}
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
      onSelectProject={() => {}}
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
