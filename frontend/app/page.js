import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Portfolio Management Portal
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
          Manage your investment portfolios with stocks and ETFs. Track performance, 
          analyze holdings, and export your data with our comprehensive portfolio management system.
        </p>
        <Link 
          href="/dashboard"
          className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}
