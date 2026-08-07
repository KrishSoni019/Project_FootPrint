import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardSidebar from '../features/dashboard/components/DashboardSidebar';

/**
 * DashboardLayout
 *
 * Shared authenticated application shell: sidebar + main content area.
 * Meant to be reused by every future authenticated page (Tasks, Members,
 * GitHub, Analysis, ...), not just the dashboard itself.
 */
export default function DashboardLayout({
  user,
  projects,
  activeProject,
  onSelectProject,
  onLogout,
  children,
}) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink-950 lg:flex">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-ink-700/80 bg-ink-950/95 px-4 py-3 backdrop-blur lg:hidden">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-signal-500/10 font-mono text-xs font-semibold text-signal-400 ring-1 ring-signal-500/30">
            fp
          </span>
          <span className="font-display text-base font-medium text-paper-100">
            FootPrint
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setIsMobileNavOpen(true)}
          aria-label="Open navigation menu"
          className="rounded-md p-1.5 text-mist-400 transition-colors hover:text-paper-100"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile drawer backdrop */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsMobileNavOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar — static on desktop, sliding drawer on mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-64 lg:translate-x-0 ${
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <DashboardSidebar
          user={user}
          projects={projects}
          activeProject={activeProject}
          onSelectProject={onSelectProject}
          onLogout={onLogout}
          onNavigate={() => setIsMobileNavOpen(false)}
          mobileCloseButton={
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(false)}
              aria-label="Close navigation menu"
              className="rounded-md p-1.5 text-mist-400 transition-colors hover:text-paper-100 lg:hidden"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          }
        />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 lg:px-10 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
