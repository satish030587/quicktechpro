"use client";

import { useMemo } from 'react';
import { useAdminSocket } from './AdminSocketProvider';

const STATUS_META = {
  connected: { label: 'Realtime online', tone: 'bg-green-500/90' },
  connecting: { label: 'Connecting…', tone: 'bg-amber-500/90' },
  disconnected: { label: 'Disconnected', tone: 'bg-gray-400/80' },
  error: { label: 'Connection error', tone: 'bg-red-500/90' },
  unavailable: { label: 'Unavailable', tone: 'bg-gray-300' },
  idle: { label: 'Idle', tone: 'bg-gray-300' },
};

export default function SocketConnection() {
  const { status, lastEvent, reconnect } = useAdminSocket();
  const meta = STATUS_META[status] || STATUS_META.idle;

  const subtitle = useMemo(() => {
    if (!lastEvent) return null;
    const when = new Date(lastEvent.at);
    if (Number.isNaN(when.getTime())) return lastEvent.type;
    return `${lastEvent.type} @ ${when.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
  }, [lastEvent]);

  return (
    <div className="flex items-center gap-3 text-xs text-gray-500">
      <span className={`h-2.5 w-2.5 rounded-full shadow-sm transition-colors duration-150 ${meta.tone}`} aria-hidden="true" />
      <div className="flex flex-col">
        <span className="font-medium text-gray-600">{meta.label}</span>
        {subtitle ? <span className="text-gray-400">{subtitle}</span> : null}
      </div>
      {status !== 'connected' && status !== 'connecting' ? (
        <button
          type="button"
          onClick={reconnect}
          className="ml-2 rounded border border-blue-200 px-2 py-1 text-[11px] font-medium text-blue-600 transition hover:border-blue-300 hover:text-blue-700"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}
