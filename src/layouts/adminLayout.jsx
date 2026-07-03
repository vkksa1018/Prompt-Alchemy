import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="admin-layout min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <h1 className="text-xl font-bold text-left m-0">Prompt-Alchemy Admin Panel</h1>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
