export const metadata = { title: 'Admin • Ticket' };

import TicketDetailClient from './ticketDetailClient';

export default function AdminTicketDetailPage({ params }) {
  return <TicketDetailClient id={params.id} />;
}

