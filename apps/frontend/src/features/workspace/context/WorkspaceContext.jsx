import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getAuthToken, clearAuthToken } from '../../auth/utils/authToken';

const API_BASE_URL = 'http://localhost:5000';
const STORAGE_KEY = 'footprint_selected_workspace_id';

/**
 * WorkspaceContext
 *
 * Bug fix: DashboardPage, TasksPage, ActivitiesPage, TimelinePage, and
 * MembersPage each used to independently fetch /api/auth/me + /api/projects
 * and silently default to projects[0], with the sidebar's onSelectProject
 * wired to a no-op on every page except Dashboard. Switching the workspace
 * from the sidebar only ever worked on Dashboard, and every other page was
 * permanently stuck on the first workspace.
 *
 * The fix centralizes "which workspace is selected" into one provider,
 * mounted once above the routed pages, so selecting a workspace anywhere
 * is visible everywhere.
 *
 * Note this only decides which workspace ID to *request* — it carries no
 * authorization weight of its own. Every route the frontend calls with a
 * project ID is still independently checked against ProjectMember on the
 * backend, so a stale or tampered client-side selection can't expose
 * another project's data.
 */
const WorkspaceContext = createContext(null);

function readStoredWorkspaceId() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    // localStorage can throw in some privacy modes — treat it as "nothing
    // stored" rather than crashing the app over a persistence nicety.
    return null;
  }
}

function writeStoredWorkspaceId(id) {
  try {
    if (id) {
      localStorage.setItem(STORAGE_KEY, id);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    // Same as above — persistence is best-effort.
  }
}

export function WorkspaceProvider({ children }) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'ready'
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedWorkspaceId, setSelectedWorkspaceIdState] = useState(
    readStoredWorkspaceId
  );

  const setSelectedWorkspaceId = useCallback((id) => {
    setSelectedWorkspaceIdState(id);
    writeStoredWorkspaceId(id);
  }, []);

  const clearWorkspace = useCallback(() => {
    setUser(null);
    setProjects([]);
    setSelectedWorkspaceIdState(null);
    writeStoredWorkspaceId(null);
    setStatus('ready');
  }, []);

  const reloadWorkspace = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      // Not logged in — nothing to load, and any leftover selection from a
      // previous session shouldn't linger.
      clearWorkspace();
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
        clearWorkspace();
        return;
      }

      if (!meResponse.ok || !projectsResponse.ok) {
        throw new Error('Failed to load workspace data.');
      }

      const meData = await meResponse.json();
      const projectsData = await projectsResponse.json();

      const loadedUser = meData.user ?? meData;
      const loadedProjects = projectsData.projects ?? [];

      setUser(loadedUser);
      setProjects(loadedProjects);

      // Restore the previously selected workspace only if it's still one
      // this user actually belongs to; otherwise fall back to the first
      // available workspace (GET /api/projects orders by joinedAt desc, so
      // that's also the most recently joined/created one).
      setSelectedWorkspaceIdState((current) => {
        const candidateId = current ?? readStoredWorkspaceId();
        const isCandidateValid =
          candidateId && loadedProjects.some((project) => project.id === candidateId);
        const nextId = isCandidateValid ? candidateId : loadedProjects[0]?.id ?? null;

        writeStoredWorkspaceId(nextId);
        return nextId;
      });

      setStatus('ready');
    } catch (error) {
      console.error('Failed to load workspace data:', error);
      setStatus('error');
    }
  }, [clearWorkspace]);

  useEffect(() => {
    reloadWorkspace();
    // Intentionally run once on mount only — pages call reloadWorkspace()
    // explicitly after events (login, workspace creation) that actually
    // require a refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedWorkspace = useMemo(
    () => projects.find((project) => project.id === selectedWorkspaceId) ?? null,
    [projects, selectedWorkspaceId]
  );

  const value = useMemo(
    () => ({
      status,
      user,
      projects,
      selectedWorkspaceId,
      selectedWorkspace,
      setSelectedWorkspaceId,
      reloadWorkspace,
      clearWorkspace,
    }),
    [
      status,
      user,
      projects,
      selectedWorkspaceId,
      selectedWorkspace,
      setSelectedWorkspaceId,
      reloadWorkspace,
      clearWorkspace,
    ]
  );

  return (
    <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }

  return context;
}
