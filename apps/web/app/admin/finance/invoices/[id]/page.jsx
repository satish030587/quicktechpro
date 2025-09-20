export const metadata = { title: 'Invoice' };

import AdminInvoiceView from './viewClient';

export default function AdminInvoicePage({ params }) { return <AdminInvoiceView id={params.id} />; }

