export const metadata = { title: 'Admin • Security' };
import AdminGuard from '../AdminGuard';
import SecurityClient from './SecurityClient';

export default function AdminSecurityPage() {
  return (
    <AdminGuard>
      <SecurityClient />
    </AdminGuard>
  );
}

