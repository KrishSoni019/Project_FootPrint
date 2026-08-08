import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw, UserPlus } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import AddMemberModal from '../components/AddMemberModal';
import { getAuthToken, clearAuthToken } from '../../auth/utils/authToken';

const API_BASE_URL = 'http://localhost:5000';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('') || '?';
}

function formatJoinedDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * MembersPage
 *
 * Same "default to the first project" pattern DashboardPage uses — this
 * app doesn't yet persist a globally-selected workspace across pages, so
 * both pages independently land on projects[0] for now.
 *
 * GET /api/projects
 * GET /api/projects/:id/members
 */
export default function MembersPage() {
  const navigate = useNavigate();

  const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'ready'
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const loadMembers = useCallback(async () => {
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
        const membersResponse = await fetch(
          `${API_BASE_URL}/api/projects/${activeProject.id}/members`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (membersResponse.status === 401) {
          clearAuthToken();
          navigate('/login');
          return;
        }

        if (!membersResponse.ok) {
          throw new Error('Failed to load members.');
        }

        const membersData = await membersResponse.json();
        setMembers(membersData.members ?? []);
      } else {
        setMembers([]);
      }

      setStatus('ready');
    } catch (error) {
      console.error('Failed to load members:', error);
      setStatus('error');
    }
  }, [navigate]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const handleLogout = () => {
    clearAuthToken();
    navigate('/login');
  };

  const handleMemberAdded = (newMember) => {
    setMembers((current) => [...current, newMember]);
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
            Loading members…
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
            Couldn't load members
          </h1>
          <p className="mt-2 text-sm text-mist-400">
            There was a problem reaching the server. Check your connection
            and try again.
          </p>
          <button
            type="button"
            onClick={loadMembers}
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
                Members
              </h1>
              <p className="mt-1.5 text-sm text-mist-400">
                Everyone with access to {project.name}.
              </p>
            </div>

            {project.role === 'OWNER' && (
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex w-fit items-center gap-2 rounded-lg bg-signal-500 px-4 py-2 text-sm font-semibold text-ink-950 transition-all duration-150 hover:bg-signal-400 hover:shadow-glow-amber focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-400/50"
              >
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Add Member
              </button>
            )}
          </div>

          <div className="mt-8 overflow-hidden rounded-xl border border-ink-700 bg-ink-900/50">
            <ul>
              {members.map((member, index) => (
                <li
                  key={member.id}
                  className={`flex items-center gap-4 px-6 py-4 ${
                    index !== members.length - 1 ? 'border-b border-ink-700/80' : ''
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-signal-500/10 font-mono text-xs font-semibold text-signal-400 ring-1 ring-signal-500/30">
                    {getInitials(member.user.name)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-paper-100">
                      {member.user.name}
                    </p>
                    <p className="truncate text-xs text-mist-500">{member.user.email}</p>
                  </div>

                  <span className="hidden shrink-0 text-xs text-mist-500 sm:block">
                    Joined {formatJoinedDate(member.joinedAt)}
                  </span>

                  <span
                    className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider ${
                      member.role === 'OWNER'
                        ? 'border-signal-500/30 bg-signal-500/10 text-signal-400'
                        : 'border-ink-700 bg-ink-800 text-mist-400'
                    }`}
                  >
                    {member.role}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <AddMemberModal
            projectId={project.id}
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onMemberAdded={handleMemberAdded}
          />
        </>
      )}
    </DashboardLayout>
  );
}
