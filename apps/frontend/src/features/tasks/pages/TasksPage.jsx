import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Plus, RefreshCw } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import TaskBoard from '../components/TaskBoard';
import CreateTaskModal from '../components/CreateTaskModal';
import { getAuthToken, clearAuthToken } from '../../auth/utils/authToken';

const API_BASE_URL = 'http://localhost:5000';

/**
 * TasksPage
 *
 * Same "default to the first project" pattern as MembersPage/DashboardPage —
 * this app doesn't persist a globally-selected workspace yet, so every page
 * independently lands on projects[0] for now.
 *
 * GET /api/projects
 * GET /api/projects/:id/members  (needed for the assignee dropdown)
 * GET /api/projects/:id/tasks
 * PATCH /api/tasks/:id
 */
export default function TasksPage() {
  const navigate = useNavigate();

  const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'ready'
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [actionError, setActionError] = useState('');

  const loadTasks = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      navigate('/login');
      return;
    }

    setStatus('loading');
    setActionError('');

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
        const [membersResponse, tasksResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/projects/${activeProject.id}/members`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/api/projects/${activeProject.id}/tasks`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (membersResponse.status === 401 || tasksResponse.status === 401) {
          clearAuthToken();
          navigate('/login');
          return;
        }

        if (!membersResponse.ok || !tasksResponse.ok) {
          throw new Error('Failed to load tasks.');
        }

        const membersData = await membersResponse.json();
        const tasksData = await tasksResponse.json();

        setMembers(membersData.members ?? []);
        setTasks(tasksData.tasks ?? []);
      } else {
        setMembers([]);
        setTasks([]);
      }

      setStatus('ready');
    } catch (error) {
      console.error('Failed to load tasks:', error);
      setStatus('error');
    }
  }, [navigate]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleLogout = () => {
    clearAuthToken();
    navigate('/login');
  };

  const handleTaskCreated = (newTask) => {
    setTasks((current) => [newTask, ...current]);
  };

  const handleStatusChange = async (taskId, nextStatus) => {
    const token = getAuthToken();
    if (!token) {
      navigate('/login');
      return;
    }

    setActionError('');
    setUpdatingTaskId(taskId);

    // Keep the previous value around so we can roll back the UI if the
    // request fails — the select shouldn't silently "stick" on a status
    // the server never actually saved.
    const previousTasks = tasks;
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, status: nextStatus } : task))
    );

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (response.status === 401) {
        clearAuthToken();
        navigate('/login');
        return;
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setTasks(previousTasks);
        setActionError(data.message || 'Could not update this task. Please try again.');
        return;
      }

      // Sync with the server's response (it also derives completedAt).
      setTasks((current) => current.map((task) => (task.id === taskId ? data.task : task)));
    } catch (error) {
      console.error('Update task request failed:', error);
      setTasks(previousTasks);
      setActionError('Unable to connect to the server. Please try again.');
    } finally {
      setUpdatingTaskId(null);
    }
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
            Loading tasks…
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
            Couldn't load tasks
          </h1>
          <p className="mt-2 text-sm text-mist-400">
            There was a problem reaching the server. Check your connection
            and try again.
          </p>
          <button
            type="button"
            onClick={loadTasks}
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
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h1 className="font-display text-2xl font-medium text-paper-100 sm:text-3xl">
                Tasks
              </h1>
              <p className="mt-1.5 text-sm text-mist-400">
                The task board for {project.name}.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-signal-500 px-4 py-2 text-sm font-semibold text-ink-950 transition-all duration-150 hover:bg-signal-400 hover:shadow-glow-amber focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-400/50"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              New Task
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
            {tasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-ink-700 px-6 py-16 text-center">
                <p className="text-sm text-mist-400">
                  No tasks yet. Create the first one to get the board moving.
                </p>
              </div>
            ) : (
              <TaskBoard
                tasks={tasks}
                onStatusChange={handleStatusChange}
                updatingTaskId={updatingTaskId}
              />
            )}
          </div>

          <CreateTaskModal
            projectId={project.id}
            members={members}
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onTaskCreated={handleTaskCreated}
          />
        </>
      )}
    </DashboardLayout>
  );
}
