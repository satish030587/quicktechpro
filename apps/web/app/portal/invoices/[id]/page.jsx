export const metadata = { title: 'Invoice' };

import InvoiceView from './viewClient';

export default function InvoicePage({ params }) {
  return <InvoiceView id={params.id} />;
}

