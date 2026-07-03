import { Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  // By default, we let users bypass the login check for development/demonstration.
  // In a real application, you'd check auth state here.
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-md w-full text-center space-y-4 p-8 bg-white dark:bg-gray-900 rounded-lg shadow border dark:border-gray-800">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">You must be logged in as an administrator to view this page.</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
