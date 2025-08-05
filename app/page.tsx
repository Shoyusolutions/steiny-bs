"use client";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Service Temporarily Suspended</h1>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-sm mx-auto">
          <p className="text-gray-600 mb-3">Error Code:</p>
          <p className="text-3xl font-mono font-bold text-gray-900">402</p>
        </div>
      </div>
    </div>
  );
}