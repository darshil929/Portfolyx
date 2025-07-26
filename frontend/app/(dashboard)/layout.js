"use client"

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Portfolio Manager</h2>
        </div>
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            <a
              href="/dashboard"
              className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="ml-3">Dashboard</span>
            </a>
            <a
              href="/dashboard/explore"
              className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="ml-3">Explore</span>
            </a>
            <a
              href="/dashboard/manage"
              className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="ml-3">Manage</span>
            </a>
            <a
              href="/dashboard/history"
              className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="ml-3">History</span>
            </a>
          </div>
        </nav>
        
        {/* Theme Toggle */}
        <div className="absolute bottom-4 left-4 right-4">
          <Button
            onClick={toggleTheme}
            variant="outline"
            className="w-full dark:border-gray-600 dark:text-gray-300"
          >
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}