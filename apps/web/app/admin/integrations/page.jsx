export const metadata = { title: 'Admin • Integrations' };
import AdminGuard from '../AdminGuard';
import IntegrationsClient from './IntegrationsClient';

export default function AdminIntegrationsPage() {
  return (
    <AdminGuard>
      <IntegrationsClient />
    </AdminGuard>
  );
}
