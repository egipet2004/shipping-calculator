'use client';

interface SessionRestoreAlertProps {
  isOpen: boolean;
  onRestore: () => void;
  onDiscard: () => void;
}

export function SessionRestoreAlert({ isOpen, onRestore, onDiscard }: SessionRestoreAlertProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl border border-gray-200 transform transition-all scale-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Resume previous session?</h3>
        <p className="text-sm text-gray-500 mb-6">
          We found unsaved data from your previous visit. Would you like to restore it or start fresh?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onDiscard}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Start Fresh
          </button>
          <button
            onClick={onRestore}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Resume Session
          </button>
        </div>
      </div>
    </div>
  );
}