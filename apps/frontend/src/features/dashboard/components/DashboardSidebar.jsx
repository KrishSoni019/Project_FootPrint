import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ListTodo,
  Activity,
  GitCommitHorizontal,
  Users,
  Github,
  BarChart3,
  FileText,
  Settings,
  ChevronsUpDown,
  LogOut,
  Check,
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' }],
  },
  {
    label: 'Work',
    items: [
      { label: 'Tasks', icon: ListTodo, to: '/tasks' },
      { label: 'Activity', icon: Activity },
      { label: 'Timeline', icon: GitCommitHorizontal },
    ],
  },
  {
    label: 'Team',
    items: [{ label: 'Members', icon: Users, to: '/members' }],
  },
  {
    label: 'Integrations',
    items: [{ label: 'GitHub', icon: Github }],
  },
  {
    label: 'Analysis',
    items: [
      { label: 'Contribution Analysis', icon: BarChart3 },
      { label: 'Reports', icon: FileText },
    ],
  },
  {
    label: 'Workspace',
    items: [{ label: 'Settings', icon: Settings }],
  },
];

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '');
  return initials.join('') || '?';
}

/**
 * DashboardSidebar
 *
 * Only items with a `to` are real, working routes — every other module is
 * visually present but disabled until its backend exists, so the nav is
 * honest about what the product can currently do.
 */
export default function DashboardSidebar({
  user,
  projects,
  activeProject,
  onSelectProject,
  onLogout,
  onNavigate,
  mobileCloseButton,
}) {
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const location = useLocation();

  const hasMultipleProjects = Boolean(projects && projects.length > 1);

  return (
    <div className="flex h-full flex-col border-r border-ink-700/80 bg-ink-900 lg:bg-ink-900/60">
      {/* Brand */}
      <div className="flex items-center justify-between px-5 pt-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-signal-500/10 font-mono text-sm font-semibold text-signal-400 ring-1 ring-signal-500/30">
            fp
          </span>
          <span className="font-display text-lg font-medium text-paper-100">
            FootPrint
          </span>
        </Link>
        {mobileCloseButton}
      </div>

      {/* Workspace selector */}
      {activeProject && (
        <div className="relative mt-6 px-5">
          <button
            type="button"
            onClick={() => hasMultipleProjects && setIsSwitcherOpen((open) => !open)}
            aria-expanded={isSwitcherOpen}
            aria-haspopup="listbox"
            className={`flex w-full items-center justify-between rounded-lg border border-ink-700 bg-ink-850/60 px-3.5 py-3 text-left transition-colors ${
              hasMultipleProjects ? 'cursor-pointer hover:border-ink-600' : 'cursor-default'
            }`}
          >
            <span className="min-w-0">
              <span className="block truncate font-display text-sm font-medium text-paper-100">
                {activeProject.name}
              </span>
              <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-wider text-signal-400/90">
                {activeProject.role}
              </span>
            </span>

            {hasMultipleProjects && (
              <ChevronsUpDown
                className="ml-2 h-3.5 w-3.5 shrink-0 text-mist-500"
                aria-hidden="true"
              />
            )}
          </button>

          {isSwitcherOpen && hasMultipleProjects && (
            <ul
              role="listbox"
              className="absolute left-5 right-5 z-10 mt-1.5 overflow-hidden rounded-lg border border-ink-700 bg-ink-850 shadow-xl shadow-black/40"
            >
              {projects.map((project) => (
                <li key={project.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={project.id === activeProject.id}
                    onClick={() => {
                      onSelectProject(project.id);
                      setIsSwitcherOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm text-paper-100 transition-colors hover:bg-ink-800"
                  >
                    <span className="truncate">{project.name}</span>
                    {project.id === activeProject.id && (
                      <Check className="h-3.5 w-3.5 shrink-0 text-signal-400" aria-hidden="true" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="mt-6 flex-1 overflow-y-auto px-3 pb-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-5">
            <p className="px-2.5 font-mono text-[10px] uppercase tracking-wider text-mist-600">
              {section.label}
            </p>

            <div className="mt-1.5 space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.to && location.pathname === item.to;

                if (item.to) {
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={onNavigate}
                      className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
                        isActive
                          ? 'bg-signal-500/10 text-signal-400'
                          : 'text-mist-400 hover:bg-ink-800 hover:text-paper-100'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <div
                    key={item.label}
                    aria-disabled="true"
                    className="flex cursor-not-allowed items-center justify-between rounded-md px-2.5 py-2 text-sm text-mist-600"
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {item.label}
                    </span>
                    <span className="rounded border border-ink-700 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-mist-600">
                      Soon
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-ink-700/80 px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-signal-500/10 font-mono text-xs font-semibold text-signal-400 ring-1 ring-signal-500/30">
            {getInitials(user?.name)}
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-paper-100">
              {user?.name || 'Loading…'}
            </p>
            <p className="truncate text-xs text-mist-500">{user?.email || ''}</p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            aria-label="Log out"
            className="rounded-md p-1.5 text-mist-500 transition-colors hover:bg-ink-800 hover:text-flag-400"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
