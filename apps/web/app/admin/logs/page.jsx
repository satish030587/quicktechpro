export const metadata = { title: 'Admin • Logs' };
import AdminGuard from '../AdminGuard';
import LogsClient from './LogsClient';

export default function AdminLogsPage() {
  return (
    <AdminGuard>
      <LogsClient />
    </AdminGuard>
  );
}

