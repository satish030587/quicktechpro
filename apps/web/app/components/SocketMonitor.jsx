"use client";

import { useMemo, useState } from 'react';
import { useAdminSocket } from './AdminSocketProvider';

export default function SocketMonitor() {
  const { status, events } = useAdminSocket();
  const [expanded, setExpanded] = useState(false);

  const recent = useMemo(() => events.slice(0, 5), [events]);

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="rounded border border-dashed border-gray-300 px-2 py-1 text-[11px] text-gray-500 hover:border-gray-400"
      >
        Socket status: {status}
      </button>
    );
  }

  return (
    <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-600 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="font-semibold">Realtime monitor</span>
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="text-[11px] font-medium text-blue-600 hover:text-blue-700"
        >
          Hide
        </button>
      </div>
      <div className="text-[11px] uppercase tracking-wide text-gray-400">Status: {status}</div>
      <ul className="space-y-1">
        {recent.length === 0 ? (
          <li className="text-gray-400">No events observed</li>
        ) : (
          recent.map((event) => (
            <li key={`${event.type}-${event.at}`}>{event.type} · {new Date(event.at).toLocaleTimeString()}</li>
          ))
        )}
      </ul>
    </div>
  );
}
