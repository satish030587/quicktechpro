export const metadata = { title: 'Ticket Details' };

import TicketDetailClient from './ticketDetailClient';

export default function TicketDetailPage({ params }) { return <TicketDetailClient id={params.id} />; }

