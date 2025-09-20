"use client";

import { useAdminSocket } from './AdminSocketProvider';

export default function RealtimeFixButton() {
  const { status, reconnect } = useAdminSocket();

  if (status === 'connected') return null;

  return (
    <button
      type="button"
      onClick={reconnect}
      className="rounded border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 shadow-sm transition hover:border-blue-300 hover:bg-blue-100"
    >
      Reconnect realtime
    </button>
  );
}
